const activarRiego = (serialPort, estado) => {
    if (estado === "ON") {
        console.log("🚨 Activando riego automático...");
        serialPort.write("RIEGO_ON\n");
    } else if (estado === "OFF") {
        console.log("✅ Apagando riego automático...");
        serialPort.write("RIEGO_OFF\n");
    }
};

/*const activarLuz = (serialPort, estado) => {
    if (estado === "ON") {
        console.log("🚨 Activando iluminacion automática...");
        serialPort.write("LUZ_ON\n");
    } else if (estado === "OFF") {
        console.log("✅ Apagando Iluminacion automático...");
        serialPort.write("LUZ_OFF\n");
    }
};*/
module.exports = { activarRiego };
