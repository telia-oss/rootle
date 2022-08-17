package rootle

import com.google.gson.Gson

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


class Rootle(private val id: String, private val application: String)  {

    inner class Http (val method: String, val statusCode: Int, val url: String, val useragent: String, val referer: String) {}
    inner class Grpc (val procedure: String, val code: Int, val service: String, val useragent: String, val referer: String) {}
    inner class Downstream(val http: Http? = null, val grpc: Grpc? = null) {}

    private inner class Log(private val id: String, private val application: String, private val timestamp: String,
              private val message: String, private val level: String,
              private val downstream: Downstream? = null, private val stacktrace: String? = null, val code: Int? = null) {
    }
     fun info(message: String) {
        val log = Log(this.id, this.application, System.currentTimeMillis().toString(), message,
                "INFO")
        val logJsonString = Gson().toJson(log)
        println(logJsonString)
    }

    fun warn(message: String) {
        val log = Log(this.id, this.application, System.currentTimeMillis().toString(), message,
                "WARN")
        val logJsonString = Gson().toJson(log)
        println(logJsonString)
    }

    fun error(message: String, downstream: Downstream, stackTrace: String, code: Int) {
        val log = Log(this.id, this.application, System.currentTimeMillis().toString(), message,
                "ERROR", downstream, stackTrace, code)
        val logJsonString = Gson().toJson(log)
        println(logJsonString)
    }
}
