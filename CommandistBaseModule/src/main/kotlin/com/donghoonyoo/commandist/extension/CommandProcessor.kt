package com.donghoonyoo.commandist.extension

import kotlinx.coroutines.*

object CommandProcessor {
    private var currentJob: Job? = null

    fun execute(command: String) {
        val timeout = 0L
        currentJob?.cancel()
        currentJob = CoroutineScope(Dispatchers.Default).launch {
            // TODO: Make executor
        }
        CoroutineScope(Dispatchers.Default).launch {
            delay(timeout)
            if((currentJob?: return@launch).isActive) {
                currentJob?.cancel()
                currentJob = null
            }
        }
    }
}