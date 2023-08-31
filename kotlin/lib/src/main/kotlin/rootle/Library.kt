package rootle

import com.google.gson.Gson
import io.grpc.*
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

enum class GrpcCodes(val code: Int) {
  Ok(0),
  Cancelled(1),
  unknown(2),
  invalidArgument(3),
  deadlineExceeded(4),
  notFound(5),
  alreadyExists(6),
  permissionDenied(7),
  resourceExhausted(8),
  failedPrecondition(9),
  aborted(10),
  outOfRange(11),
  unimplemented(12),
  internalError(13),
  unavailable(14),
  dataLoss(15),
  unauthenticated(16),
}

enum class StatusCode(val code: Int) {
  Continue(100),
  SwitchingProtocols(101),
  Processing(102),
  OK(200),
  Created(201),
  Accepted(202),
  NonAuthoritativeInformation(203),
  NoContent(204),
  ResetContent(205),
  PartialContent(206),
  MultiStatus(207),
  AlreadyReported(208),
  IMUsed(226),
  MultipleChoices(300),
  MovedPermanently(301),
  Found(302),
  SeeOther(303),
  NotModified(304),
  UseProxy(305),
  TemporaryRedirect(307),
  PermanentRedirect(308),
  BadRequest(400),
  Unauthorized(401),
  PaymentRequired(402),
  Forbidden(403),
  NotFound(404),
  MethodNotAllowed(405),
  NotAcceptable(406),
  ProxyAuthenticationRequired(407),
  RequestTimeout(408),
  Conflict(409),
  Gone(410),
  LengthRequired(411),
  PreconditionFailed(412),
  PayloadTooLarge(413),
  UriTooLong(414),
  UnsupportedMediaType(415),
  RangeNotSatisfiable(416),
  ExpectationFailed(417),
  IAmATeapot(418),
  MisdirectedRequest(421),
  UnprocessableEntity(422),
  Locked(423),
  FailedDependency(424),
  UpgradeRequired(426),
  PreconditionRequired(428),
  TooManyRequests(429),
  RequestHeaderFieldsTooLarge(431),
  UnavailableForLegalReasons(451),
  InternalServerError(500),
  NotImplemented(501),
  BadGateway(502),
  ServiceUnavailable(503),
  GatewayTimeout(504),
  HttpVersionNotSupported(505),
  VariantAlsoNegotiates(506),
  InsufficientStorage(507),
  LoopDetected(508),
  NotExtended(510),
  NetworkAuthenticationRequired(511),
  Unknown(0)
}

class InterceptorRequestSources(var useragent: String? = null, var referer: String? = null) {}

var localId: String = ""
var localApplication: String = ""
var localInterceptorRequestSources: InterceptorRequestSources? = null

class Grpc(
    var procedure: String? = null,
    var code: Int? = null,
    var service: String? = null,
    var useragent: String? = null,
    var referer: String? = null,
    var payload: String? = null
) {}

class Http(
    var method: String? = null,
    var statusCode: Int? = null,
    var url: String? = null,
    var useragent: String? = null,
    var referer: String? = null,
    var payload: String? = null
) {}

class Downstream(var http: Http? = null, var grpc: Grpc? = null) {}

class Rootle(
    private val id: String,
    private val application: String,
    private var interceptorRequestSources: InterceptorRequestSources? = null
) {
  init {
    localId = this.id
    localApplication = this.application
    localInterceptorRequestSources = this.interceptorRequestSources
  }
  private inner class Log(
      private val id: String,
      private val application: String,
      private val time: String,
      private val message: String,
      private val level: String,
      private val event: String? = null,
      private val downstream: Downstream? = null,
      private val stacktrace: String? = null,
      val code: Int? = null
  ) {}

  fun getCurrentTimeInISO8601(): String {
    val now = ZonedDateTime.now(ZoneOffset.UTC)
    return now.format(DateTimeFormatter.ISO_INSTANT)
  }

  fun info(message: String) {
    val log = Log(this.id, this.application, getCurrentTimeInISO8601(), message, "INFO")
    val logJsonString = Gson().toJson(log)
    println(logJsonString)
  }

  fun warn(message: String) {
    val log = Log(this.id, this.application, getCurrentTimeInISO8601(), message, "WARN")
    val logJsonString = Gson().toJson(log)
    println(logJsonString)
  }

  fun error(
      message: String,
      event: String? = null,
      downstream: Downstream? = null,
      stackTrace: String? = null,
      code: Int? = null
  ) {
    val log =
        Log(
            this.id,
            this.application,
            getCurrentTimeInISO8601(),
            message,
            "ERROR",
            event,
            downstream,
            stackTrace,
            code
        )
    val logJsonString = Gson().toJson(log)
    println(logJsonString)
  }

  fun getInterceptorRequestSources(): InterceptorRequestSources? {
    return this.interceptorRequestSources
  }
}

fun GetRootle(): Rootle {
  return Rootle(localId, localApplication, localInterceptorRequestSources)
}

class Interceptor : ClientInterceptor {
  override fun <ReqT : Any, RespT : Any> interceptCall(
      method: MethodDescriptor<ReqT, RespT>,
      callOptions: CallOptions,
      next: Channel
  ): ClientCall<ReqT, RespT> {
    return object :
        ForwardingClientCall.SimpleForwardingClientCall<ReqT, RespT>(
            next.newCall(method, callOptions)
        ) {
      val grpcErrorLog = Grpc()
      override fun start(responseListener: Listener<RespT>, headers: Metadata) {

        val logger = GetRootle()
        val interceptorRequestSources = logger.getInterceptorRequestSources()

        val targetService = method.fullMethodName.split("/")
        val serviceName = targetService[0]
        val procedure = targetService[1]
        //                TODO: Refelct Request message and extract
        //                var referer = interceptorRequestSources?.referer
        //                var useragent =  interceptorRequestSources?.useragent
        grpcErrorLog.procedure = procedure
        grpcErrorLog.service = serviceName

        super.start(
            object :
                ForwardingClientCallListener.SimpleForwardingClientCallListener<RespT>(
                    responseListener
                ) {
              override fun onClose(status: Status?, trailers: Metadata?) {
                grpcErrorLog.code = status?.code?.value()
                val message = status?.description ?: ""
                logger.error(message, grpcErrorLog.payload, Downstream(null, grpcErrorLog), null, 1)
                super.onClose(status, trailers)
              }
            },
            headers
        )
      }
      override fun sendMessage(message: ReqT) {
        grpcErrorLog.payload = message.toString()
        super.sendMessage(message)
      }
    }
  }
}
