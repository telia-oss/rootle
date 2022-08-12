package rootle

import com.google.gson.Gson

class Rootle(private val id: String, private val application: String)  {

    inner class Downstream(val code: Int, val host: String) {}

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
