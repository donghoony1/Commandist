package com.donghoonyoo.commandist.basemodule.component

import com.donghoonyoo.commandist.extension.annotation.Command
import com.donghoonyoo.commandist.extension.annotation.Parameter
import com.donghoonyoo.commandist.extension.model.CommandResult
import kotlin.math.pow

@Command("calc")
object Calculator {
    @Parameter("", 3000)
    private fun execute(callback: (CommandResult) -> Unit, fullCommand: String, afterParameter: String) {
        // ...
    }

    val operators = mapOf<String, (Double, Double) -> Double>(
        "^" to { a, b -> a.pow(b) },
        "*" to { a, b -> a * b },
        "/" to { a, b -> a / b },
        "+" to { a, b -> a + b },
        "-" to { a, b -> a - b },
    )

    private fun IntRange.calculateRangeSearcher(expression: String, end: Boolean) = if(end) {
        find { expression.isOperator(it) }
    } else {
        findLast { expression.isOperator(it - 1) }
    }?: if(end) {
        last + 1
    } else {
        first - 1
    }
    private fun String.isOperator(index: Int) = !operators.keys.all { substring(index, index + 1) != it }

    private fun String.toDoubleSafely() = toDoubleOrNull()?: 0.0

    private fun String.calculateGeneralExpression(): Double {
        var mutableExp = this
        operators.forEach { (char, calc) ->
            //println(mutableExp)
            while(mutableExp.contains(char)) {
//                println()
//                println(mutableExp)
                val operatorIndex = mutableExp.indexOf(char)
//                println("$char $operatorIndex")
                val startIndex = (1..(operatorIndex)).calculateRangeSearcher(mutableExp, false)
                val endIndex = ((operatorIndex + 1) until mutableExp.length).calculateRangeSearcher(mutableExp, true)
//                println("$operatorIndex/$startIndex/$endIndex/${mutableExp.substring(startIndex, operatorIndex)}/${mutableExp.substring(operatorIndex + 1, endIndex)}")
//                println("${mutableExp.substring(0, startIndex)}/${mutableExp.substring(endIndex)}")
                mutableExp = mutableExp.substring(0, startIndex) +
                        calc(
                            mutableExp.substring(startIndex, operatorIndex).toDoubleSafely(),
                            mutableExp.substring(operatorIndex + 1, endIndex).toDoubleSafely()) +
                        mutableExp.substring(endIndex)
            }
        }
        return Math.floor(mutableExp.toDoubleSafely() * 100000000) / 100000000
    }

    private fun divideBrackets(expression: String) {

    }
}