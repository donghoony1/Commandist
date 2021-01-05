package com.donghoonyoo.commandist.extension

import com.donghoonyoo.commandist.extension.model.CommandResult
import kotlinx.coroutines.*
import kotlin.reflect.full.callSuspend

object CommandProcessor {
    private var currentJob: Job? = null

    @ExperimentalStdlibApi
    fun execute(command: String) {
        val timeout = 0L
        currentJob?.cancel()
        currentJob = CoroutineScope(Dispatchers.Default).launch {
            val args = command.split(" ")
            if(args.isNotEmpty()) {
                val commandSet = CommandistExtension.commandSets[args[0]]
                if(commandSet == null) {
                    currentJob = null
                    cancel()
                    return@launch
                }

                val callback: (List<CommandResult>) -> Unit = {
                    println("$command\n" + it.joinToString("\n") { it.toJSON() })
                    currentJob = null
                    cancel()
                }

                if(args[1] in commandSet.parameters.keys) {
                    commandSet.parameters[args[1]]?.callSuspend(
                        callback,
                        command,
                        args.slice(IntRange(1, args.size - 1)).joinToString(" "),
                        args)
                } else if(commandSet.defaultExecutor != null) {
                    commandSet.defaultExecutor.callSuspend(
                        callback,
                        command,
                        args.slice(IntRange(2, args.size - 1)).joinToString(" "),
                        args)
                }
            }
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