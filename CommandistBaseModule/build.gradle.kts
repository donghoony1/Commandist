plugins {
    java
    kotlin("jvm") version "1.4.21"
    kotlin("plugin.serialization") version "1.4.21"
    id("com.github.johnrengelman.shadow") version "6.1.0"
}

repositories {
    mavenCentral()
    jcenter()
    maven("https://kotlin.bintray.com/kotlinx")
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("org.jetbrains.kotlin", "kotlin-reflect", "1.4.21")
    implementation("org.jetbrains.kotlinx", "kotlinx-coroutines-core", "1.4.2")
    implementation("org.jetbrains.kotlinx", "kotlinx-serialization-json", "1.0.1")
    implementation("org.jetbrains.kotlinx", "kotlinx-cli", "0.3")
    implementation("com.google.guava", "guava", "30.1-jre")
}

tasks {
    named<com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar>("shadowJar") {
        archiveBaseName.set("CommandistBaseModule")
        mergeServiceFiles()
        manifest {
            attributes(mapOf("Main-Class" to "com.donghoonyoo.commandist.extension.CommandistExtension"))
        }
    }
}