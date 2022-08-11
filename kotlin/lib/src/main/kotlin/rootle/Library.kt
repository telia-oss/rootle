package rootle

import com.google.gson.Gson

class Rootle {
    fun info(message: String) {
        val log = Log("123", System.currentTimeMillis().toString(), message,
                "INFO", "Invoice-Lambda", 0, "")
        val logJsonString = Gson().toJson(log)
        println(logJsonString)
    }
}


class Log(val id: String, val timestamp: String, 
val message: String, val level: String,
val application: String, val status: Int, val stacktrace: String) {
    override fun toString(): String {
        return "Log(id='$id', timestamp='$timestamp', message='$message', level='$level', application='$application', status=$status, stacktrace='$stacktrace')"
    }
}

fun main() {

    val rootle = Rootle()
    
    rootle.info("Hello World")
}