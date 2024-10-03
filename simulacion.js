<<<<<<< HEAD
// Variables globales para las masas
let bandera, masa1, masa2, constanteElasticidad, coeficienteFriccion,constanteAmortiguamiento, fuerzaExterna,frecuenciaExterna, x0, v0, tipoMov, chartInstance;

// Función para inicializar y dibujar las masas desde el inicio (sin movimiento)
function init() {
    let simulacionResorte = document.getElementById("simulacionResorte");
    let ctx = simulacionResorte.getContext("2d");
    draw(ctx, 0); // Dibujar con posición inicial 0 (en reposo)
}

// Función para la integración numérica (Euler simple)
function simulate(masa1, masa2, constanteElasticidad, coeficienteFriccion,constanteAmortiguamiento, fuerzaExterna, frecuenciaExterna, x0, v0, tipoMov) {
    let dt = 0.02; // Paso de tiempo
    let t = 0;
    let x = x0; // Posición inicial
    let v = v0; // Velocidad inicial
    let simulacionResorte = document.getElementById("simulacionResorte");
    let ctx = simulacionResorte.getContext("2d");

    const maxDisplacement=simulacionResorte.width/4;
    // Función para calcular la aceleración basada en la ecuación diferencial
    function accelerationSimple(x, v, t) {
        let force = -constanteElasticidad * x - coeficienteFriccion * v;
        if (tipoMov === "forzado") {
            force += fuerzaExterna * Math.cos(t); // Fuerza externa en caso de sistema forzado
        }
        return force / (masa1+masa2);
    }

    //Función para calcular la aceleración de un sistema amortiguado
    function accelerationAmortiguado(x, v) {
        let fuerzaResorte = -constanteElasticidad * x; // Fuerza del resorte
        let fuerzaAmortiguamiento = -constanteAmortiguamiento * v; // Inicializar amortiguamiento a 0

        let fuerzaTotal = fuerzaResorte + fuerzaAmortiguamiento;

        return fuerzaTotal / (masa1+masa2);
    }
    // Función para calcular la aceleración en el sistema forzado
    function accelerationForzado(x, v, t) {
        let fuerzaResorte = -constanteElasticidad * x;
        let fuerzaForzada = fuerzaExterna * Math.cos(frecuenciaExterna*t); // Fuerza externa oscilante
        let fuerzaTotal = fuerzaResorte + fuerzaForzada;
        return fuerzaTotal / (masa1+masa2);
    }
    function accelerationForzadoAmortiguado(x, v, t) {
        let fuerzaResorte = -constanteElasticidad * x;
        let fuerzaAmortiguamiento = -constanteAmortiguamiento * v;
        let fuerzaForzada = fuerzaExterna * Math.cos(frecuenciaExterna*t); // Fuerza externa oscilante
        let fuerzaTotal = fuerzaResorte + fuerzaAmortiguamiento + fuerzaForzada;
        return fuerzaTotal / (masa1+masa2);
    }
    // Función para dibujar una flecha
    function drawArrow(ctx, startX, startY, length) {
        // Dibuja la línea principal de la flecha
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + length, startY); // Cambia la dirección y longitud según sea necesario
        ctx.stroke();
    
        // Dibuja la punta de la flecha
        ctx.beginPath();
        ctx.moveTo(startX + length, startY);
        ctx.lineTo(startX + length - 10, startY - 5); // Punta izquierda
        ctx.moveTo(startX + length, startY);
        ctx.lineTo(startX + length - 10, startY + 5); // Punta derecha
        ctx.stroke();
    }
    // Función para dibujar las dos masas en el canvas
    function draw(ctx, x) {
        ctx.clearRect(0, 0, simulacionResorte.width, simulacionResorte.height);

        // Tamaños y posiciones de las masas
        let xBase = simulacionResorte.width / 2 + x * 50; // Escala la posición horizontalmente
        if (xBase < 50) xBase = 50; // Evita que se salga del canvas por la izquierda
        if (xBase > simulacionResorte.width - 50) xBase = simulacionResorte.width - 50; // Evita que se salga por la derecha

        let size1 = 60; // Tamaño de masa 1
        let size2 = 40; // Tamaño de masa 2 (más pequeña)

        // Coordenadas de la masa 1 (mayor)
        let y1 = simulacionResorte.height - size1; // La masa 1 está en el "suelo" del canvas

        // Coordenadas de la masa 2 (más pequeña, encima de la masa 1)
        let y2 = y1 - size2; // La masa 2 se apila encima de la masa 1

        // Dibuja masa 1 (cuadrado)
        ctx.fillStyle = "blue";
        ctx.fillRect(xBase - size1 / 2, y1, size1, size1);

        // Dibuja masa 2 (cuadrado)
        ctx.fillStyle = "red";
        ctx.fillRect(xBase - size2 / 2, y2, size2, size2);

        // Dibuja el resorte como una línea horizontal
        ctx.beginPath();
        ctx.moveTo(0, simulacionResorte.height - size1 / 2); // Línea que empieza a la izquierda
        ctx.lineTo(xBase - size1 / 2, simulacionResorte.height - size1 / 2); // Conecta al bloque
        ctx.stroke();

        if (tipoMov === "2"||tipoMov === "4") {
            ctx.fillStyle = "gray";
            ctx.fillRect(0, simulacionResorte.height - 10, simulacionResorte.width, 10); // Línea de suelo
        }
        if (tipoMov === "3"||tipoMov === "4") {
            drawArrow(ctx, xBase + size1 / 2 + 10, y1 + size1 / 2, 50); // Ajusta la posición y longitud de la flecha
        }   
    }

    // Loop de simulación
    function step() {
        if (tipoMov === "1") {
            a = accelerationSimple(x, v, t);
        } else if (tipoMov === "2") {
            a = accelerationAmortiguado(x, v);;
        } else if (tipoMov === "3") {
            a = accelerationForzado(x, v, t);
        }else if (tipoMov === "4") {
            a = accelerationForzadoAmortiguado(x, v, t);
        }
        v += a * dt;
        x += v * dt;
        t += dt;

        draw(ctx, x); // Dibuja en cada paso

        requestAnimationFrame(step); // Hace que el movimiento sea continuo
    }
   step(); 
}

function graficarTodasLasEcuacionesMAS(amplitud, omega0, anguloCorregido) {
    let ctx = document.getElementById("graficosMovimiento").getContext("2d");
    let tiempos = [];
    let posiciones = [];
    let velocidades = [];
    let aceleraciones = [];
    let dt = 0.1;
    let tiempoMax = 10;

    // Calcula los valores de posición, velocidad y aceleración en función del tiempo
    for (let t = 0; t <= tiempoMax; t += dt) {
        tiempos.push(t);
        let x = amplitud * Math.cos(omega0 * t + anguloCorregido); // Posición
        let v = -amplitud * omega0 * Math.sin(omega0 * t + anguloCorregido); // Velocidad
        let a = -amplitud * omega0 * omega0 * Math.cos(omega0 * t + anguloCorregido); // Aceleración
        posiciones.push(x);
        velocidades.push(v);
        aceleraciones.push(a);
    }

    // Destruir el gráfico previo si existe
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Crea el gráfico con los tres datasets
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tiempos,
            datasets: [
                {
                    label: 'Posición x(t)',
                    data: posiciones,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Velocidad v(t)',
                    data: velocidades,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Aceleración a(t)',
                    data: aceleraciones,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: { 
                    title: { display: true, text: 'Tiempo (t)' },
                    ticks:{
                        callback:function(value){
                            return value.toFixed(0);
                        }
                    }
                },    
                y: { title: { display: true, text: 'Valor' } }
            }
        }
    });
}
function graficarTodasLasEcuacionesForzadoAmortiguado(masa1, masa2, amplitud, omega0, coeficienteAmortiguamiento, fuerzaExterna, frecuenciaExterna) {
    let ctx = document.getElementById("graficosMovimiento").getContext("2d");
    let tiempos = [];
    let posiciones = [];
    let velocidades = [];
    let aceleraciones = [];
    let dt = 0.1;
    let tiempoMax = 10;
    
    let x = amplitud;  // Posición inicial
    let v = 0;         // Velocidad inicial         
    
    // Calcula los valores de posición, velocidad y aceleración en función del tiempo
    for (let t = 0; t <= tiempoMax; t += dt) {
        tiempos.push(t);
    
        // Ecuación de movimiento forzado amortiguado:
        // a = (fuerza externa * cos(frecuenciaExterna * t) - b*v - k*x) / m
        let a = (fuerzaExterna * Math.cos(frecuenciaExterna * t) - coeficienteAmortiguamiento * v - omega0 * omega0 * x) / (masa1+masa2);
    
        // Actualización de posición y velocidad usando integración numérica (Método de Euler)
        v += a * dt;  // Velocidad: v = v0 + a * dt
        x += v * dt;  // Posición: x = x0 + v * dt
    
        posiciones.push(x);
        velocidades.push(v);
        aceleraciones.push(a);
    }
    
    // Destruir el gráfico previo si existe
    if (chartInstance) {
        chartInstance.destroy();        
    }

    // Crea el gráfico con los tres datasets
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tiempos,
            datasets: [
                {
                    label: 'Posición x(t)',
                    data: posiciones,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                   label: 'Velocidad v(t)',
                    data: velocidades,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false                  
                },
                {
                    label: 'Aceleración a(t)',
                    data: aceleraciones,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: { 
                    title: { display: true, text: 'Tiempo (t)' },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(0);
                        }
                    }
                },    
                y: { title: { display: true, text: 'Valor' } }
            }
        }
    });
    
    // Mostrar el gráfico inicialmente
    document.getElementById("graficosMovimiento").style.display = "block";
}
function graficarMovimientoForzadoSinAmortiguamiento(masa1, masa2, fuerzaExterna, frecuenciaExterna) {
    const ctx = document.getElementById("graficosMovimiento").getContext("2d");
    let tiempos = [];
    let posiciones = [];
    let velocidades = [];
    let aceleraciones = [];
    let dt = 0.1; // Paso de tiempo
    let tiempoMax = 10; // Tiempo total de simulación
    
    let x = 0;  // Posición inicial
    let v = 0;  // Velocidad inicial
    
    // Calcula los valores de posición, velocidad y aceleración en función del tiempo
    for (let t = 0; t <= tiempoMax; t += dt) {
        tiempos.push(t);

        // Ecuación de movimiento forzado:
        // a = (fuerza externa * cos(frecuenciaExterna * t) - k*x) / m
        let a = (fuerzaExterna * Math.cos(frecuenciaExterna * t) - constanteElasticidad * x) / (masa1 + masa2);

        // Actualización de posición y velocidad usando integración numérica (Método de Euler)
        v += a * dt;  // Velocidad: v = v0 + a * dt
        x += v * dt;  // Posición: x = x0 + v * dt

        posiciones.push(x);
        velocidades.push(v);
        aceleraciones.push(a);
    }
    
    // Destruir el gráfico previo si existe
    if (chartInstance) {
        chartInstance.destroy();        
    }

    // Crea el gráfico con los tres datasets
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tiempos,
            datasets: [
                {
                    label: 'Posición x(t)',
                    data: posiciones,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Velocidad v(t)',
                    data: velocidades,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false                  
                },
                {
                    label: 'Aceleración a(t)',
                    data: aceleraciones,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: { 
                    title: { display: true, text: 'Tiempo (t)' },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(0);
                        }
                    }
                },    
                y: { title: { display: true, text: 'Valor' } }
            }
        }
    });
    
    // Mostrar el gráfico inicialmente
    document.getElementById("graficosMovimiento").style.display = "block";
}
function mostrarEcuacionMovimientoMAS(masa1, constanteElasticidad, x0, v0) {
    let anguloCorregido; //angulo corregido
    // Calcular la frecuencia angular ω0
    let omega0 = Math.sqrt(constanteElasticidad / (masa1+masa2));
    console.log("x0 (condición inicial posición):", x0);
    console.log("v0 (condición inicial velocidad):", v0);
    if (omega0 === 0) {
        console.error("La frecuencia angular ω0 es cero. Verifica tus parámetros.");
        return;
    }
    if (v0 === 0) {
       if (x0<0) {
        anguloCorregido = Math.PI;
        }else if (x0>0) {
            anguloCorregido = 0;
        }else if (x0===0) {
           alert("La posición inicial es cero, al igual que la velocidad. No se puede calcular la ecuación del movimiento porque el movimiento es nulo.");
        }
    }
    if (x0 === 0) {
        if (v0>0) {
            anguloCorregido = 3*Math.PI/2;
        }else if (v0<0) {
            anguloCorregido = 3*Math.PI/2;
        }else if (v0===0) {
            alert("La posición inicial es cero, al igual que la velocidad. No se puede calcular la ecuación del movimiento porque el movimiento es nulo.");
        }
    }
    // Calcular la fase φ usando las ecuaciones de posición y velocidad en t = 0
    let ecuacionParaAngulo=(-v0/(omega0*x0));
    let angulo = Math.atan(ecuacionParaAngulo); // φ = arctan(-v0 / (ω0 * x0))
    //gravedad
    let g=9.81;

    //Amplitud fija inicial
    let A=(coeficienteFriccion*g*(masa1+masa2))/constanteElasticidad;

    // Calcular coseno y seno del ángulo φ en t = 0
    let cosPhi = x0 / A;
    let sinPhi = -v0 / (A * omega0);

    // Tomar el valor absoluto de la fase φ
    let anguloAbsoluto = Math.abs(angulo);

    // Determinar en qué cuadrante está el ángulo y corregirlo
    if (sinPhi > 0 && cosPhi > 0) {
        // Primer cuadrante, no hay corrección
        anguloCorregido=anguloAbsoluto;
        //console.log("Ángulo en el primer cuadrante");
    } else if (sinPhi > 0 && cosPhi < 0) {
        // Segundo cuadrante
        anguloCorregido = Math.PI - anguloAbsoluto;
        //console.log("Ángulo en el segundo cuadrante, corregido restando pi");
    } else if (sinPhi < 0 && cosPhi < 0) {
        // Tercer cuadrante
        anguloCorregido = Math.PI + anguloAbsoluto;
        //console.log("Ángulo en el tercer cuadrante, corregido sumando pi");
    } else if (sinPhi < 0 && cosPhi > 0) {
        // Cuarto cuadrante
        anguloCorregido = (2*Math.PI)-anguloAbsoluto;
        //console.log("Ángulo en el cuarto cuadrante, corregido restando 2pi");
    }
    
    // 3. Calcular la amplitud A final usando la posición inicial
    let cosenoAmplitud = Math.cos(anguloCorregido);
    let amplitud = x0 / cosenoAmplitud; // A = x(0) / cos(φ)
    console.log("A:", A);

//condición para saber si la masa pequeña no se cae 
    if (amplitud > A) {
        alert("La amplitud no puede ser mayor que la amplitud fija inicial, verifica tus parámetros.");
        return;
    }else{
        // Actualizar la ecuación en el HTML
        bandera=true;
        let equation = document.getElementById("edo1");
        equation.innerHTML = `x(t) = ${amplitud.toFixed(2)} cos(${omega0.toFixed(2)}t + ${anguloCorregido.toFixed(2)})`;

        graficarTodasLasEcuacionesMAS(amplitud, omega0, anguloCorregido);
    }

    
}
function graficarMovimientoAmortiguado(masa1, masa2, constanteElasticidad, coeficienteAmortiguamiento,x0,v0) {
    const ctx = document.getElementById("graficosMovimiento").getContext("2d");
        let tiempos = [];
        let posiciones = [];
        let velocidades = [];
        let aceleraciones = [];
        let dt = 0.1; // Paso de tiempo
        let tiempoMax = 10; // Tiempo total de simulación

        let x = x0;  // Posición inicial
        let v = v0;  // Velocidad inicial

        // Calcula los valores de posición, velocidad y aceleración en función del tiempo
        for (let t = 0; t <= tiempoMax; t += dt) {
            tiempos.push(t);

            // Ecuación de movimiento amortiguado:
            // a = (-k*x - b*v) / m
            let a = (-constanteElasticidad * x - coeficienteAmortiguamiento * v) / (masa1 + masa2);

            // Actualización de posición y velocidad usando integración numérica (Método de Euler)
            v += a * dt;  // Velocidad: v = v0 + a * dt
            x += v * dt;  // Posición: x = x0 + v * dt

            posiciones.push(x);
            velocidades.push(v);
            aceleraciones.push(a);
        }

        // Destruir el gráfico previo si existe
        if (chartInstance) {
            chartInstance.destroy();        
        }

        // Crea el gráfico con los tres datasets
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: tiempos,
                datasets: [
                    {
                        label: 'Posición x(t)',
                        data: posiciones,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: 'Velocidad v(t)',
                        data: velocidades,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        fill: false                  
                    },
                    {
                        label: 'Aceleración a(t)',
                        data: aceleraciones,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    x: { 
                        title: { display: true, text: 'Tiempo (t)' },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(0);
                            }
                        }
                    },    
                    y: { title: { display: true, text: 'Valor' } }
                }
            }
        });

        // Mostrar el gráfico inicialmente
        document.getElementById("graficosMovimiento").style.display = "block";
}
function mostrarEcuacionMovimientoAmortiguado(masa1, masa2, constanteElasticidad, constanteAmortiguamiento, x0, v0) {
    let M = masa1 + masa2;
    let r = constanteAmortiguamiento / (2 * M); // r = B / (2M)
    let omega0Squared = constanteElasticidad / M;
    console.log("Valores iniciales:");
    console.log("M (masa total):", M);
    console.log("r (gamma):", r);
    console.log("omega0Squared (ω0^2):", omega0Squared);
    console.log("x0 (condición inicial posición):", x0);
    console.log("v0 (condición inicial velocidad):", v0);
    if (omega0Squared > Math.round(r * r) ) {
        let omega = Math.sqrt(omega0Squared - r * r);
        let ecuacionParaAngulo=((-v0-r*x0)/(omega*x0));
        let phi = Math.atan(ecuacionParaAngulo); 

        // Tomar el valor absoluto de la fase φ
        let anguloAbsoluto = Math.abs(phi);
        // Calcular el ángulo corregido
        //el coseno depende del signo de la posición inicial
        //el seno depende de la velocidad incial y del signo obtenido para el coseno
        // Determinar en qué cuadrante está el ángulo y corregirlo
        if (x0 >= 0) { // Primer o cuarto cuadrante: coseno positivo
            if(v0>= 0){ //cuarto cuadrante: el seno debe ser negativo
                anguloCorregido = (2 * Math.PI) - anguloAbsoluto;
            }else{//velocidad negativa: seno positivo
                //primer cuadrante :D
                anguloCorregido = anguloAbsoluto;
            }
        } else{//posición inicial negativa: coseno negativo
            if(v0>= 0){//velocidad positiva: seno positivo
                //segundo cuadrante
                if(v0>=x0*r){
                    anguloCorregido = Math.PI +anguloAbsoluto;
                    
                }else{
                anguloCorregido = Math.PI -anguloAbsoluto;
                }
            }else{//velocidad negativa: seno negativo
                //tercer cuadrante :D
                anguloCorregido = Math.PI + anguloAbsoluto;
            }
        }
        //gravedad
       let g=9.81;
        let C = x0 / Math.cos(anguloCorregido); // Amplitud para el subamortiguado
        //Amplitud fija inicial
        let A=(coeficienteFriccion*g*(masa1+masa2))/constanteElasticidad;
    //condición para saber si la masa pequeña no se cae    
        if (C > A) {
            alert("La amplitud no puede ser mayor que la amplitud fija inicial, verifica tus parámetros.");
            return;
        }else{
            bandera=true;
            let equation = document.getElementById("edo1");
            equation.innerHTML = `x(t) = ${C.toFixed(2)} e<sup>(-${r.toFixed(2)}t)</sup>cos(${omega.toFixed(2)}t + ${anguloCorregido.toFixed(2)})`;
        }
    } else if (Math.round(omega0Squared) === Math.round(r * r)) {
        //Amortiguamiento critico
        let c1 = x0;
        let c2 = v0 + r * x0;
          // Amplitud máxima en el críticamente amortiguado
          // Calcular el tiempo en que x(t) es máxima
        let tMax = (c2-(r*c1)) / (r*c2); // Suponiendo que c2 no es cero
        let amplitudMaxima_critica = (c1 + c2 * tMax) * Math.exp(-r * tMax);  
        let A=(coeficienteFriccion*9.81*(masa1+masa2))/constanteElasticidad;      
          if (amplitudMaxima_critica > A) {
              alert("La amplitud máxima en el caso críticamente amortiguado excede la amplitud inicial, verifica los parámetros.");
              return;
          }
        bandera=true;
        let equation = document.getElementById("edo1");
        equation.innerHTML = `x(t) = (${+c1.toFixed(2)} + ${c2.toFixed(2)} t) e<sup>(-${r.toFixed(2)}t)</sup>`;

    } else {
        //Sobreamortiguado
        console.log("sobreamortiguado");
        let s1 = -r + (Math.sqrt((r * r) - omega0Squared));
        let s2 = -r - (Math.sqrt((r * r) - omega0Squared));
        let denominator = s2 - s1;
        let c2 = (v0 - (s1 * x0)) / denominator;
        let c1 = x0 - c2;
        // Amplitud máxima en el sobreamortiguado
        let A_sobreamortiguado = Math.abs(c1) + Math.abs(c2);
        let A=(coeficienteFriccion*(9.81)*(masa1+masa2))/constanteElasticidad;
        if (A_sobreamortiguado > A) {
            alert("La amplitud máxima en el caso sobreamortiguado excede la amplitud inicial, verifica los parámetros.");
            return;
        }
        bandera=true;
        console.log("s1",s1);
        console.log("s2",s2);
        let equation = document.getElementById("edo1");
        equation.innerHTML = `x(t) =  ${c1.toFixed(3)} e<sup>(${s1.toFixed(2)} t)</sup> +( ${c2.toFixed(3)} e<sup>(${s2.toFixed(2)} t)</sup>)`;

    }
    // Graficar las ecuaciones
    graficarMovimientoAmortiguado(masa1, masa2, constanteElasticidad, constanteAmortiguamiento, x0, v0);
}
function mostrarEcuacionMovimientoForzado(masa1, masa2, constanteElasticidad, fuerzaExterna, frecuenciaExterna) {
    const wo = Math.sqrt(constanteElasticidad / (masa1 + masa2)); // Frecuencia natural
    let delta;
    bandera=true;
    if(Math.round(wo) === Math.round(frecuenciaExterna)){
        let C = (fuerzaExterna) / (2 * wo * (masa1 + masa2));
        // Imprimir la ecuación
        let equation = document.getElementById('edo1');
        equation.innerHTML = `x(t) = ${C.toFixed(2)}t sen(${wo.toFixed(2)}t)`;
    } else{
        // Determinar el delta
        if (wo > frecuenciaExterna) {
            delta = 0; // Sin desfase
      } else {
        delta = Math.PI; // Desfase de π
      }
  
        // Calcular C
        let C = (fuerzaExterna * Math.cos(delta)) / ((masa1 + masa2) * ((wo * wo) - (frecuenciaExterna * frecuenciaExterna)));
      bandera=true;
        // Imprimir la ecuación
        let equation = document.getElementById('edo1');
        equation.innerHTML = `x(t) = ${C.toFixed(2)} cos(${frecuenciaExterna.toFixed(2)}t - ${delta.toFixed(2)})`;
    }
    graficarMovimientoForzadoSinAmortiguamiento(masa1, masa2, fuerzaExterna, frecuenciaExterna);
}
function mostrarEcuacionMovimientoForzadoAmortiguado(masa1, masa2, constanteAmortiguamiento, constanteElasticidad, fuerzaExterna, frecuenciaExterna){

    // Calcular los valores de γ y omega0
    let gamma = constanteAmortiguamiento / (2 * (masa1 + masa2));
    let omega0 = Math.sqrt(constanteElasticidad / (masa1 + masa2));
        
    // Calcular A y δ
    let delta = Math.atan((2 * gamma * frecuenciaExterna) / (Math.pow(omega0, 2) - Math.pow(frecuenciaExterna, 2)));
    let amplitud = (fuerzaExterna / masa1 + masa2) / Math.sqrt(Math.pow(Math.pow(omega0, 2) - Math.pow(frecuenciaExterna, 2), 2) + Math.pow(2 * gamma * frecuenciaExterna, 2));


    //Corregir el delta de acuerdo al cuadrante al que pertenece
    let seno=0;
    let coseno=0;
    //miramos si el numerador de delta es positivo o negativo (este corresponde al seno)
    if(gamma<0){//si gamma es negativo
        if(frecuenciaExterna<0){ //si la frecuencia también es negativa, el numerador es positivo, ergo, el seno es positivo
            seno=1;//seno positivo
        }else{//si tienen signos contrarios, el numerador es negativo
            seno=-1;//seno negativo
        }
    }else{//si gamma es positivo
        if(frecuenciaExterna>=0){//frecuencia también positiva, el numerador es positivo
            seno=1;
        }else{//tienen signos contrarios, entonces el numerador es negativo
            seno=-1//
        }
    }
    //miramos si el denominador de delta es positivo o negativo (este corresponde al coseno)
    if(omega0*omega0>frecuenciaExterna*frecuenciaExterna){ //si el omega0 al cuadrado es mayor que la frecuencia externa al cuadrado, el denominador es positivo
        coseno=1;//el coseno es positivo
    }else{//si le frecuenciaExterna^2 es mayor al omega0^2, el denominador es negativo
        coseno=-1;//el coseno es negativo
    }
    //Conociendo los signos, podemos determinar el cuadrante
    if(seno>=0 && coseno>=0){//si ambos son positivos, están en el primer cuadrante
        delta=Math.abs(delta);
    }else if(seno>=0 && coseno<0){//seno positivo, coseno negativo, segundo cuadrante
        delta=Math.PI- Math.abs(delta);
    }else if(seno<0 && coseno <0){//seno negativo y coseno negativo, tercer cuadrante
        delta=Math.PI + Math.abs(delta);
    }else{//seno negativo y coseno positivo, cuarto cuadrante
        delta= (2*Math.PI) - Math.abs(delta);
    }

    // Actualizar la ecuación en el HTML
    let equation = document.getElementById("edo1");
    equation.innerHTML =`x(t) = ${amplitud.toFixed(3)} cos(${frecuenciaExterna.toFixed(2)}t -(${delta.toFixed(2)}))`;

    graficarTodasLasEcuacionesForzadoAmortiguado(masa1, masa2, amplitud, omega0, constanteAmortiguamiento, fuerzaExterna, frecuenciaExterna);

}

document.getElementById('tipoGrafica').addEventListener('change', function() {
    let seleccion = this.value;
    
    // Mostrar el contenedor de las gráficas
    //document.getElementById("divGraficaMovimiento").style.display = "block";

    // Dependiendo de la selección, ocultar o mostrar las gráficas individuales
    if (chartInstance) {
        // Mostrar todas las gráficas
        if (seleccion === "14") {
            chartInstance.data.datasets[0].hidden=false, // Posición
            chartInstance.data.datasets[1].hidden=false, // Velocidad
            chartInstance.data.datasets[2].hidden=false, // Aceleración
            chartInstance.options.scales.y.title.text = 'Valor'; // Título genérico para el eje Y
        } else if (seleccion === "11") {
            chartInstance.data.datasets[0].hidden=false; // Mostrar solo posición
            chartInstance.data.datasets[1].hidden = true; // Velocidad
            chartInstance.data.datasets[2].hidden = true; // Aceleración
            chartInstance.options.scales.y.title.text = 'Posición (x)'; // Actualiza el título del eje Y
        } else if (seleccion === "12") {
            chartInstance.data.datasets[0].hidden=true; // Posicion
            chartInstance.data.datasets[1].hidden = false; // Mostrar solo Velocidad
            chartInstance.data.datasets[2].hidden = true; // Aceleración
            chartInstance.options.scales.y.title.text = 'Velocidad (v)'; // Actualiza el título del eje Y
        } else if (seleccion === "13") {
            chartInstance.data.datasets[0].hidden = true; // Posición
            chartInstance.data.datasets[1].hidden = true; // Velocidad
            chartInstance.data.datasets[2].hidden=false; // Mostrar solo aceleración
            chartInstance.options.scales.y.title.text = 'Aceleración (a)'; // Actualiza el título del eje Y
        }
        chartInstance.update(); // Actualizar el gráfico
    }
});
// Cuando se presiona el botón de simular
document.getElementById('Calcular').addEventListener('click', function (e) {
    e.preventDefault();
    bandera=false;
    // Recoger los valores ingresados por el usuario
    masa1 = parseFloat(document.getElementById('masa1').value);
    masa2 = parseFloat(document.getElementById('masa2').value);
    constanteElasticidad = parseFloat(document.getElementById('constanteElasticidad').value);
    coeficienteFriccion = parseFloat(document.getElementById('coeficienteFriccion').value);
    constanteAmortiguamiento=parseFloat(document.getElementById('amortiguamiento').value);
    frecuenciaExterna = parseFloat(document.getElementById('frecuenciaExterna').value);
    fuerzaExterna = parseFloat(document.getElementById('fuerzaExterna').value);
    x0 = parseFloat(document.getElementById('posicionInicial').value);
    v0 = parseFloat(document.getElementById('velocidadInicial').value);
    tipoMov = document.getElementById('tipoMovimiento').value;
    // Validación: masa2 debe ser menor que masa1
    if (masa2 >= masa1) {
        alert("La masa 2 debe ser menor que la masa 1.");
        return;
    }
    //Mostrar la ecuación de movimiento
    switch(tipoMov){
        case "1":
            mostrarEcuacionMovimientoMAS(masa1, constanteElasticidad, x0, v0);
            break;
        case "2":
            mostrarEcuacionMovimientoAmortiguado(masa1, masa2, constanteElasticidad, constanteAmortiguamiento, x0, v0);
            break;
        case "3":
            mostrarEcuacionMovimientoForzado(masa1, masa2, constanteElasticidad, fuerzaExterna, frecuenciaExterna);
            break;
        case "4":
            mostrarEcuacionMovimientoForzadoAmortiguado(masa1, masa2, constanteAmortiguamiento, constanteElasticidad, fuerzaExterna, frecuenciaExterna);
            break;
    }
    if(bandera){
        // Inicia la simulación
        console.log('entra a bandera');
        simulate(masa1, masa2, constanteElasticidad, coeficienteFriccion,constanteAmortiguamiento, fuerzaExterna,frecuenciaExterna, x0, v0, tipoMov);
    }
    
});
// Llama a init() cuando cargue la página para que dibuje las masas estáticas
window.onload = init;
=======
// Variables globales para las masas
let bandera, masa1, masa2, constanteElasticidad, coeficienteFriccion,constanteAmortiguamiento, fuerzaExterna,frecuenciaExterna, x0, v0, tipoMov, chartInstance;

// Función para inicializar y dibujar las masas desde el inicio (sin movimiento)
function init() {
    let simulacionResorte = document.getElementById("simulacionResorte");
    let ctx = simulacionResorte.getContext("2d");
    draw(ctx, 0); // Dibujar con posición inicial 0 (en reposo)
}

// Función para la integración numérica (Euler simple)
function simulate(masa1, masa2, constanteElasticidad, coeficienteFriccion,constanteAmortiguamiento, fuerzaExterna, frecuenciaExterna, x0, v0, tipoMov) {
    let dt = 0.02; // Paso de tiempo
    let t = 0;
    let x = x0; // Posición inicial
    let v = v0; // Velocidad inicial
    let simulacionResorte = document.getElementById("simulacionResorte");
    let ctx = simulacionResorte.getContext("2d");

    const maxDisplacement=simulacionResorte.width/4;
    // Función para calcular la aceleración basada en la ecuación diferencial
    function accelerationSimple(x, v, t) {
        let force = -constanteElasticidad * x - coeficienteFriccion * v;
        if (tipoMov === "forzado") {
            force += fuerzaExterna * Math.cos(t); // Fuerza externa en caso de sistema forzado
        }
        return force / (masa1+masa2);
    }

    //Función para calcular la aceleración de un sistema amortiguado
    function accelerationAmortiguado(x, v) {
        let fuerzaResorte = -constanteElasticidad * x; // Fuerza del resorte
        let fuerzaAmortiguamiento = -constanteAmortiguamiento * v; // Inicializar amortiguamiento a 0

        let fuerzaTotal = fuerzaResorte + fuerzaAmortiguamiento;

        return fuerzaTotal / (masa1+masa2);
    }
    // Función para calcular la aceleración en el sistema forzado
    function accelerationForzado(x, v, t) {
        let fuerzaResorte = -constanteElasticidad * x;
        let fuerzaForzada = fuerzaExterna * Math.cos(frecuenciaExterna*t); // Fuerza externa oscilante
        let fuerzaTotal = fuerzaResorte + fuerzaForzada;
        return fuerzaTotal / (masa1+masa2);
    }
    function accelerationForzadoAmortiguado(x, v, t) {
        let fuerzaResorte = -constanteElasticidad * x;
        let fuerzaAmortiguamiento = -constanteAmortiguamiento * v;
        let fuerzaForzada = fuerzaExterna * Math.cos(frecuenciaExterna*t); // Fuerza externa oscilante
        let fuerzaTotal = fuerzaResorte + fuerzaAmortiguamiento + fuerzaForzada;
        return fuerzaTotal / (masa1+masa2);
    }
    // Función para dibujar una flecha
    function drawArrow(ctx, startX, startY, length) {
        // Dibuja la línea principal de la flecha
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + length, startY); // Cambia la dirección y longitud según sea necesario
        ctx.stroke();
    
        // Dibuja la punta de la flecha
        ctx.beginPath();
        ctx.moveTo(startX + length, startY);
        ctx.lineTo(startX + length - 10, startY - 5); // Punta izquierda
        ctx.moveTo(startX + length, startY);
        ctx.lineTo(startX + length - 10, startY + 5); // Punta derecha
        ctx.stroke();
    }
    // Función para dibujar las dos masas en el canvas
    function draw(ctx, x) {
        ctx.clearRect(0, 0, simulacionResorte.width, simulacionResorte.height);

        // Tamaños y posiciones de las masas
        let xBase = simulacionResorte.width / 2 + x * 50; // Escala la posición horizontalmente
        if (xBase < 50) xBase = 50; // Evita que se salga del canvas por la izquierda
        if (xBase > simulacionResorte.width - 50) xBase = simulacionResorte.width - 50; // Evita que se salga por la derecha

        let size1 = 60; // Tamaño de masa 1
        let size2 = 40; // Tamaño de masa 2 (más pequeña)

        // Coordenadas de la masa 1 (mayor)
        let y1 = simulacionResorte.height - size1; // La masa 1 está en el "suelo" del canvas

        // Coordenadas de la masa 2 (más pequeña, encima de la masa 1)
        let y2 = y1 - size2; // La masa 2 se apila encima de la masa 1

        // Dibuja masa 1 (cuadrado)
        ctx.fillStyle = "blue";
        ctx.fillRect(xBase - size1 / 2, y1, size1, size1);

        // Dibuja masa 2 (cuadrado)
        ctx.fillStyle = "red";
        ctx.fillRect(xBase - size2 / 2, y2, size2, size2);

        // Dibuja el resorte como una línea horizontal
        ctx.beginPath();
        ctx.moveTo(0, simulacionResorte.height - size1 / 2); // Línea que empieza a la izquierda
        ctx.lineTo(xBase - size1 / 2, simulacionResorte.height - size1 / 2); // Conecta al bloque
        ctx.stroke();

        if (tipoMov === "2"||tipoMov === "4") {
            ctx.fillStyle = "gray";
            ctx.fillRect(0, simulacionResorte.height - 10, simulacionResorte.width, 10); // Línea de suelo
        }
        if (tipoMov === "3"||tipoMov === "4") {
            drawArrow(ctx, xBase + size1 / 2 + 10, y1 + size1 / 2, 50); // Ajusta la posición y longitud de la flecha
        }   
    }

    // Loop de simulación
    function step() {
        if (tipoMov === "1") {
            a = accelerationSimple(x, v, t);
        } else if (tipoMov === "2") {
            a = accelerationAmortiguado(x, v);;
        } else if (tipoMov === "3") {
            a = accelerationForzado(x, v, t);
        }else if (tipoMov === "4") {
            a = accelerationForzadoAmortiguado(x, v, t);
        }
        v += a * dt;
        x += v * dt;
        t += dt;

        draw(ctx, x); // Dibuja en cada paso

        requestAnimationFrame(step); // Hace que el movimiento sea continuo
    }
   step(); 
}

function graficarTodasLasEcuacionesMAS(amplitud, omega0, anguloCorregido) {
    let ctx = document.getElementById("graficosMovimiento").getContext("2d");
    let tiempos = [];
    let posiciones = [];
    let velocidades = [];
    let aceleraciones = [];
    let dt = 0.1;
    let tiempoMax = 10;

    // Calcula los valores de posición, velocidad y aceleración en función del tiempo
    for (let t = 0; t <= tiempoMax; t += dt) {
        tiempos.push(t);
        let x = amplitud * Math.cos(omega0 * t + anguloCorregido); // Posición
        let v = -amplitud * omega0 * Math.sin(omega0 * t + anguloCorregido); // Velocidad
        let a = -amplitud * omega0 * omega0 * Math.cos(omega0 * t + anguloCorregido); // Aceleración
        posiciones.push(x);
        velocidades.push(v);
        aceleraciones.push(a);
    }

    // Destruir el gráfico previo si existe
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Crea el gráfico con los tres datasets
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tiempos,
            datasets: [
                {
                    label: 'Posición x(t)',
                    data: posiciones,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Velocidad v(t)',
                    data: velocidades,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Aceleración a(t)',
                    data: aceleraciones,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: { 
                    title: { display: true, text: 'Tiempo (t)' },
                    ticks:{
                        callback:function(value){
                            return value.toFixed(0);
                        }
                    }
                },    
                y: { title: { display: true, text: 'Valor' } }
            }
        }
    });
}
function graficarTodasLasEcuacionesForzadoAmortiguado(masa1, masa2, amplitud, omega0, coeficienteAmortiguamiento, fuerzaExterna, frecuenciaExterna) {
    let ctx = document.getElementById("graficosMovimiento").getContext("2d");
    let tiempos = [];
    let posiciones = [];
    let velocidades = [];
    let aceleraciones = [];
    let dt = 0.1;
    let tiempoMax = 10;
    
    let x = amplitud;  // Posición inicial
    let v = 0;         // Velocidad inicial         
    
    // Calcula los valores de posición, velocidad y aceleración en función del tiempo
    for (let t = 0; t <= tiempoMax; t += dt) {
        tiempos.push(t);
    
        // Ecuación de movimiento forzado amortiguado:
        // a = (fuerza externa * cos(frecuenciaExterna * t) - b*v - k*x) / m
        let a = (fuerzaExterna * Math.cos(frecuenciaExterna * t) - coeficienteAmortiguamiento * v - omega0 * omega0 * x) / (masa1+masa2);
    
        // Actualización de posición y velocidad usando integración numérica (Método de Euler)
        v += a * dt;  // Velocidad: v = v0 + a * dt
        x += v * dt;  // Posición: x = x0 + v * dt
    
        posiciones.push(x);
        velocidades.push(v);
        aceleraciones.push(a);
    }
    
    // Destruir el gráfico previo si existe
    if (chartInstance) {
        chartInstance.destroy();        
    }

    // Crea el gráfico con los tres datasets
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tiempos,
            datasets: [
                {
                    label: 'Posición x(t)',
                    data: posiciones,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                   label: 'Velocidad v(t)',
                    data: velocidades,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false                  
                },
                {
                    label: 'Aceleración a(t)',
                    data: aceleraciones,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: { 
                    title: { display: true, text: 'Tiempo (t)' },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(0);
                        }
                    }
                },    
                y: { title: { display: true, text: 'Valor' } }
            }
        }
    });
    
    // Mostrar el gráfico inicialmente
    document.getElementById("graficosMovimiento").style.display = "block";
}
function graficarMovimientoForzadoSinAmortiguamiento(masa1, masa2, fuerzaExterna, frecuenciaExterna) {
    const ctx = document.getElementById("graficosMovimiento").getContext("2d");
    let tiempos = [];
    let posiciones = [];
    let velocidades = [];
    let aceleraciones = [];
    let dt = 0.1; // Paso de tiempo
    let tiempoMax = 10; // Tiempo total de simulación
    
    let x = 0;  // Posición inicial
    let v = 0;  // Velocidad inicial
    
    // Calcula los valores de posición, velocidad y aceleración en función del tiempo
    for (let t = 0; t <= tiempoMax; t += dt) {
        tiempos.push(t);

        // Ecuación de movimiento forzado:
        // a = (fuerza externa * cos(frecuenciaExterna * t) - k*x) / m
        let a = (fuerzaExterna * Math.cos(frecuenciaExterna * t) - constanteElasticidad * x) / (masa1 + masa2);

        // Actualización de posición y velocidad usando integración numérica (Método de Euler)
        v += a * dt;  // Velocidad: v = v0 + a * dt
        x += v * dt;  // Posición: x = x0 + v * dt

        posiciones.push(x);
        velocidades.push(v);
        aceleraciones.push(a);
    }
    
    // Destruir el gráfico previo si existe
    if (chartInstance) {
        chartInstance.destroy();        
    }

    // Crea el gráfico con los tres datasets
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tiempos,
            datasets: [
                {
                    label: 'Posición x(t)',
                    data: posiciones,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Velocidad v(t)',
                    data: velocidades,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false                  
                },
                {
                    label: 'Aceleración a(t)',
                    data: aceleraciones,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: { 
                    title: { display: true, text: 'Tiempo (t)' },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(0);
                        }
                    }
                },    
                y: { title: { display: true, text: 'Valor' } }
            }
        }
    });
    
    // Mostrar el gráfico inicialmente
    document.getElementById("graficosMovimiento").style.display = "block";
}
function mostrarEcuacionMovimientoMAS(masa1, constanteElasticidad, x0, v0) {
    let anguloCorregido; //angulo corregido
    // Calcular la frecuencia angular ω0
    let omega0 = Math.sqrt(constanteElasticidad / (masa1+masa2));
    console.log("x0 (condición inicial posición):", x0);
    console.log("v0 (condición inicial velocidad):", v0);
    if (omega0 === 0) {
        console.error("La frecuencia angular ω0 es cero. Verifica tus parámetros.");
        return;
    }
    if (v0 === 0) {
       if (x0<0) {
        anguloCorregido = Math.PI;
        }else if (x0>0) {
            anguloCorregido = 0;
        }else if (x0===0) {
           alert("La posición inicial es cero, al igual que la velocidad. No se puede calcular la ecuación del movimiento porque el movimiento es nulo.");
        }
    }
    if (x0 === 0) {
        if (v0>0) {
            anguloCorregido = 3*Math.PI/2;
        }else if (v0<0) {
            anguloCorregido = 3*Math.PI/2;
        }else if (v0===0) {
            alert("La posición inicial es cero, al igual que la velocidad. No se puede calcular la ecuación del movimiento porque el movimiento es nulo.");
        }
    }
    // Calcular la fase φ usando las ecuaciones de posición y velocidad en t = 0
    let ecuacionParaAngulo=(-v0/(omega0*x0));
    let angulo = Math.atan(ecuacionParaAngulo); // φ = arctan(-v0 / (ω0 * x0))
    //gravedad
    let g=9.81;

    //Amplitud fija inicial
    let A=(coeficienteFriccion*g*(masa1+masa2))/constanteElasticidad;

    // Calcular coseno y seno del ángulo φ en t = 0
    let cosPhi = x0 / A;
    let sinPhi = -v0 / (A * omega0);

    // Tomar el valor absoluto de la fase φ
    let anguloAbsoluto = Math.abs(angulo);

    // Determinar en qué cuadrante está el ángulo y corregirlo
    if (sinPhi > 0 && cosPhi > 0) {
        // Primer cuadrante, no hay corrección
        anguloCorregido=anguloAbsoluto;
        //console.log("Ángulo en el primer cuadrante");
    } else if (sinPhi > 0 && cosPhi < 0) {
        // Segundo cuadrante
        anguloCorregido = Math.PI - anguloAbsoluto;
        //console.log("Ángulo en el segundo cuadrante, corregido restando pi");
    } else if (sinPhi < 0 && cosPhi < 0) {
        // Tercer cuadrante
        anguloCorregido = Math.PI + anguloAbsoluto;
        //console.log("Ángulo en el tercer cuadrante, corregido sumando pi");
    } else if (sinPhi < 0 && cosPhi > 0) {
        // Cuarto cuadrante
        anguloCorregido = (2*Math.PI)-anguloAbsoluto;
        //console.log("Ángulo en el cuarto cuadrante, corregido restando 2pi");
    }
    
    // 3. Calcular la amplitud A final usando la posición inicial
    let cosenoAmplitud = Math.cos(anguloCorregido);
    let amplitud = x0 / cosenoAmplitud; // A = x(0) / cos(φ)
    console.log("A:", A);

//condición para saber si la masa pequeña no se cae 
    if (amplitud > A) {
        alert("La amplitud no puede ser mayor que la amplitud fija inicial, verifica tus parámetros.");
        return;
    }else{
        // Actualizar la ecuación en el HTML
        bandera=true;
        let equation = document.getElementById("edo1");
        equation.innerHTML = `x(t) = ${amplitud.toFixed(2)} cos(${omega0.toFixed(2)}t + ${anguloCorregido.toFixed(2)})`;

        graficarTodasLasEcuacionesMAS(amplitud, omega0, anguloCorregido);
    }

    
}
function graficarMovimientoAmortiguado(masa1, masa2, constanteElasticidad, coeficienteAmortiguamiento,x0,v0) {
    const ctx = document.getElementById("graficosMovimiento").getContext("2d");
        let tiempos = [];
        let posiciones = [];
        let velocidades = [];
        let aceleraciones = [];
        let dt = 0.1; // Paso de tiempo
        let tiempoMax = 10; // Tiempo total de simulación

        let x = x0;  // Posición inicial
        let v = v0;  // Velocidad inicial

        // Calcula los valores de posición, velocidad y aceleración en función del tiempo
        for (let t = 0; t <= tiempoMax; t += dt) {
            tiempos.push(t);

            // Ecuación de movimiento amortiguado:
            // a = (-k*x - b*v) / m
            let a = (-constanteElasticidad * x - coeficienteAmortiguamiento * v) / (masa1 + masa2);

            // Actualización de posición y velocidad usando integración numérica (Método de Euler)
            v += a * dt;  // Velocidad: v = v0 + a * dt
            x += v * dt;  // Posición: x = x0 + v * dt

            posiciones.push(x);
            velocidades.push(v);
            aceleraciones.push(a);
        }

        // Destruir el gráfico previo si existe
        if (chartInstance) {
            chartInstance.destroy();        
        }

        // Crea el gráfico con los tres datasets
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: tiempos,
                datasets: [
                    {
                        label: 'Posición x(t)',
                        data: posiciones,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: 'Velocidad v(t)',
                        data: velocidades,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        fill: false                  
                    },
                    {
                        label: 'Aceleración a(t)',
                        data: aceleraciones,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    x: { 
                        title: { display: true, text: 'Tiempo (t)' },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(0);
                            }
                        }
                    },    
                    y: { title: { display: true, text: 'Valor' } }
                }
            }
        });

        // Mostrar el gráfico inicialmente
        document.getElementById("graficosMovimiento").style.display = "block";
}
function mostrarEcuacionMovimientoAmortiguado(masa1, masa2, constanteElasticidad, constanteAmortiguamiento, x0, v0) {
    let M = masa1 + masa2;
    let r = constanteAmortiguamiento / (2 * M); // r = B / (2M)
    let omega0Squared = constanteElasticidad / M;
    console.log("Valores iniciales:");
    console.log("M (masa total):", M);
    console.log("r (gamma):", r);
    console.log("omega0Squared (ω0^2):", omega0Squared);
    console.log("x0 (condición inicial posición):", x0);
    console.log("v0 (condición inicial velocidad):", v0);
    if (omega0Squared > Math.round(r * r) ) {
        let omega = Math.sqrt(omega0Squared - r * r);
        let ecuacionParaAngulo=((-v0-r*x0)/(omega*x0));
        let phi = Math.atan(ecuacionParaAngulo); 

        // Tomar el valor absoluto de la fase φ
        let anguloAbsoluto = Math.abs(phi);
        // Calcular el ángulo corregido
        //el coseno depende del signo de la posición inicial
        //el seno depende de la velocidad incial y del signo obtenido para el coseno
        // Determinar en qué cuadrante está el ángulo y corregirlo
        if (x0 >= 0) { // Primer o cuarto cuadrante: coseno positivo
            if(v0>= 0){ //cuarto cuadrante: el seno debe ser negativo
                anguloCorregido = (2 * Math.PI) - anguloAbsoluto;
            }else{//velocidad negativa: seno positivo
                //primer cuadrante :D
                anguloCorregido = anguloAbsoluto;
            }
        } else{//posición inicial negativa: coseno negativo
            if(v0>= 0){//velocidad positiva: seno positivo
                //segundo cuadrante
                anguloCorregido = Math.PI - anguloAbsoluto;
            }else{//velocidad negativa: seno negativo
                //tercer cuadrante :D
                anguloCorregido = Math.PI + anguloAbsoluto;
            }
        }
        //gravedad
       let g=9.81;
        let C = x0 / Math.cos(anguloCorregido); // Amplitud para el subamortiguado
        //Amplitud fija inicial
        let A=(coeficienteFriccion*g*(masa1+masa2))/constanteElasticidad;
    //condición para saber si la masa pequeña no se cae    
        if (C > A) {
            alert("La amplitud no puede ser mayor que la amplitud fija inicial, verifica tus parámetros.");
            return;
        }else{
            bandera=true;
            let equation = document.getElementById("edo1");
            equation.innerHTML = `x(t) = ${C.toFixed(2)} e<sup>(-${r.toFixed(2)}t)</sup>cos(${omega.toFixed(2)}t + ${anguloCorregido.toFixed(2)})`;
        }
    } else if (omega0Squared === Math.round(r * r)) {
        //Amortiguamiento critico
        let c1 = x0;
        let c2 = v0 + r * x0;
          // Amplitud máxima en el críticamente amortiguado
          // Calcular el tiempo en que x(t) es máxima
        let tMax = (c2-(r*c1)) / (r*c2); // Suponiendo que c2 no es cero
        let amplitudMaxima_critica = (c1 + c2 * tMax) * Math.exp(-r * tMax);  
        let A=(coeficienteFriccion*g*(masa1+masa2))/constanteElasticidad;      
          if (amplitudMaxima_critica > A) {
              alert("La amplitud máxima en el caso críticamente amortiguado excede la amplitud inicial, verifica los parámetros.");
              return;
          }
        bandera=true;
        let equation = document.getElementById("edo1");
        equation.innerHTML = `x(t) = (${+c1.toFixed(2)} + ${c2.toFixed(2)} t) e<sup>(-${r.toFixed(2)}t)</sup>`;

    } else {
        //Sobreamortiguado
        let s1 = -r + Math.sqrt(r * r - omega0Squared);
        let s2 = -r - Math.sqrt(r * r - omega0Squared);
        let denominator = s2 - s1;
        let c2 = (v0 - s1 * x0) / denominator;
        let c1 = x0 - c2;
        // Amplitud máxima en el sobreamortiguado
        let A_sobreamortiguado = Math.abs(c1) + Math.abs(c2);
        let A=(coeficienteFriccion*g*(masa1+masa2))/constanteElasticidad;
        if (A_sobreamortiguado > A) {
            alert("La amplitud máxima en el caso sobreamortiguado excede la amplitud inicial, verifica los parámetros.");
            return;
        }
        bandera=tue;
        let equation = document.getElementById("edo1");
        equation.innerHTML = `x(t) =  ${c1.toFixed(3)} e<sup>(${s1.toFixed(2)} t)</sup> +( ${c2.toFixed(3)} e<sup>(${s2.toFixed(2)} t)</sup>)`;

    }
    // Graficar las ecuaciones
    graficarMovimientoAmortiguado(masa1, masa2, constanteElasticidad, constanteAmortiguamiento, x0, v0);
}
function mostrarEcuacionMovimientoForzado(masa1, masa2, constanteElasticidad, fuerzaExterna, frecuenciaExterna) {
    const wo = Math.sqrt(constanteElasticidad / (masa1 + masa2)); // Frecuencia natural
    let delta;
  
    if(wo === frecuenciaExterna){
        let C = (fuerzaExterna) / (2 * wo * (masa1 + masa2));
        // Imprimir la ecuación
        let equation = document.getElementById('edo1');
        equation.innerHTML = `x(t) = ${C.toFixed(2)}t sen(${wo.toFixed(2)}t)`;
    } else{
        // Determinar el delta
        if (wo > frecuenciaExterna) {
            delta = 0; // Sin desfase
      } else {
        delta = Math.PI; // Desfase de π
      }
  
        // Calcular C
        let C = (fuerzaExterna * Math.cos(delta)) / ((masa1 + masa2) * (wo * 2 - frecuenciaExterna * 2));
  
        // Imprimir la ecuación
        let equation = document.getElementById('edo1');
        equation.innerHTML = `x(t) = ${C.toFixed(2)} cos(${frecuenciaExterna.toFixed(2)}t - ${delta.toFixed(2)})`;
    }
    graficarMovimientoForzadoSinAmortiguamiento(masa1, masa2, fuerzaExterna, frecuenciaExterna);
}
function mostrarEcuacionMovimientoForzadoAmortiguado(masa1, masa2, constanteAmortiguamiento, constanteElasticidad, fuerzaExterna, frecuenciaExterna){

    // Calcular los valores de γ y omega0
    let gamma = constanteAmortiguamiento / (2 * (masa1 + masa2));
    let omega0 = Math.sqrt(constanteElasticidad / (masa1 + masa2));
        
    // Calcular A y δ
    let delta = Math.atan((2 * gamma * frecuenciaExterna) / (Math.pow(omega0, 2) - Math.pow(frecuenciaExterna, 2)));
    let amplitud = (fuerzaExterna / masa1 + masa2) / Math.sqrt(Math.pow(Math.pow(omega0, 2) - Math.pow(frecuenciaExterna, 2), 2) + Math.pow(2 * gamma * frecuenciaExterna, 2));


    //Corregir el delta de acuerdo al cuadrante al que pertenece
    let seno=0;
    let coseno=0;
    //miramos si el numerador de delta es positivo o negativo (este corresponde al seno)
    if(gamma<0){//si gamma es negativo
        if(frecuenciaExterna<0){ //si la frecuencia también es negativa, el numerador es positivo, ergo, el seno es positivo
            seno=1;//seno positivo
        }else{//si tienen signos contrarios, el numerador es negativo
            seno=-1;//seno negativo
        }
    }else{//si gamma es positivo
        if(frecuenciaExterna>=0){//frecuencia también positiva, el numerador es positivo
            seno=1;
        }else{//tienen signos contrarios, entonces el numerador es negativo
            seno=-1//
        }
    }
    //miramos si el denominador de delta es positivo o negativo (este corresponde al coseno)
    if(omega0*omega0>frecuenciaExterna*frecuenciaExterna){ //si el omega0 al cuadrado es mayor que la frecuencia externa al cuadrado, el denominador es positivo
        coseno=1;//el coseno es positivo
    }else{//si le frecuenciaExterna^2 es mayor al omega0^2, el denominador es negativo
        coseno=-1;//el coseno es negativo
    }
    //Conociendo los signos, podemos determinar el cuadrante
    if(seno>=0 && coseno>=0){//si ambos son positivos, están en el primer cuadrante
        delta=Math.abs(delta);
    }else if(seno>=0 && coseno<0){//seno positivo, coseno negativo, segundo cuadrante
        delta=Math.PI- Math.abs(delta);
    }else if(seno<0 && coseno <0){//seno negativo y coseno negativo, tercer cuadrante
        delta=Math.PI + Math.abs(delta);
    }else{//seno negativo y coseno positivo, cuarto cuadrante
        delta= (2*Math.PI) - Math.abs(delta);
    }

    // Actualizar la ecuación en el HTML
    let equation = document.getElementById("edo1");
    equation.innerHTML =`x(t) = ${amplitud.toFixed(3)} cos(${frecuenciaExterna.toFixed(2)}t -(${delta.toFixed(2)}))`;

    graficarTodasLasEcuacionesForzadoAmortiguado(masa1, masa2, amplitud, omega0, constanteAmortiguamiento, fuerzaExterna, frecuenciaExterna);

}

document.getElementById('tipoGrafica').addEventListener('change', function() {
    let seleccion = this.value;
    
    // Mostrar el contenedor de las gráficas
    //document.getElementById("divGraficaMovimiento").style.display = "block";

    // Dependiendo de la selección, ocultar o mostrar las gráficas individuales
    if (chartInstance) {
        // Mostrar todas las gráficas
        if (seleccion === "14") {
            chartInstance.data.datasets[0].hidden=false, // Posición
            chartInstance.data.datasets[1].hidden=false, // Velocidad
            chartInstance.data.datasets[2].hidden=false, // Aceleración
            chartInstance.options.scales.y.title.text = 'Valor'; // Título genérico para el eje Y
        } else if (seleccion === "11") {
            chartInstance.data.datasets[0].hidden=false; // Mostrar solo posición
            chartInstance.data.datasets[1].hidden = true; // Velocidad
            chartInstance.data.datasets[2].hidden = true; // Aceleración
            chartInstance.options.scales.y.title.text = 'Posición (x)'; // Actualiza el título del eje Y
        } else if (seleccion === "12") {
            chartInstance.data.datasets[0].hidden=true; // Posicion
            chartInstance.data.datasets[1].hidden = false; // Mostrar solo Velocidad
            chartInstance.data.datasets[2].hidden = true; // Aceleración
            chartInstance.options.scales.y.title.text = 'Velocidad (v)'; // Actualiza el título del eje Y
        } else if (seleccion === "13") {
            chartInstance.data.datasets[0].hidden = true; // Posición
            chartInstance.data.datasets[1].hidden = true; // Velocidad
            chartInstance.data.datasets[2].hidden=false; // Mostrar solo aceleración
            chartInstance.options.scales.y.title.text = 'Aceleración (a)'; // Actualiza el título del eje Y
        }
        chartInstance.update(); // Actualizar el gráfico
    }
});
// Cuando se presiona el botón de simular
document.getElementById('Calcular').addEventListener('click', function (e) {
    e.preventDefault();
    bandera=false;
    // Recoger los valores ingresados por el usuario
    masa1 = parseFloat(document.getElementById('masa1').value);
    masa2 = parseFloat(document.getElementById('masa2').value);
    constanteElasticidad = parseFloat(document.getElementById('constanteElasticidad').value);
    coeficienteFriccion = parseFloat(document.getElementById('coeficienteFriccion').value);
    constanteAmortiguamiento=parseFloat(document.getElementById('amortiguamiento').value);
    frecuenciaExterna = parseFloat(document.getElementById('frecuenciaExterna').value);
    fuerzaExterna = parseFloat(document.getElementById('fuerzaExterna').value);
    x0 = parseFloat(document.getElementById('posicionInicial').value);
    v0 = parseFloat(document.getElementById('velocidadInicial').value);
    tipoMov = document.getElementById('tipoMovimiento').value;
    // Validación: masa2 debe ser menor que masa1
    if (masa2 >= masa1) {
        alert("La masa 2 debe ser menor que la masa 1.");
        return;
    }
    //Mostrar la ecuación de movimiento
    switch(tipoMov){
        case "1":
            mostrarEcuacionMovimientoMAS(masa1, constanteElasticidad, x0, v0);
            break;
        case "2":
            mostrarEcuacionMovimientoAmortiguado(masa1, masa2, constanteElasticidad, constanteAmortiguamiento, x0, v0);
            break;
        case "3":
            mostrarEcuacionMovimientoForzado(masa1, masa2, constanteElasticidad, fuerzaExterna, frecuenciaExterna);
            break;
        case "4":
            mostrarEcuacionMovimientoForzadoAmortiguado(masa1, masa2, constanteAmortiguamiento, constanteElasticidad, fuerzaExterna, frecuenciaExterna);
            break;
    }
    if(bandera){
        // Inicia la simulación
        console.log('entra a bandera');
        simulate(masa1, masa2, constanteElasticidad, coeficienteFriccion,constanteAmortiguamiento, fuerzaExterna,frecuenciaExterna, x0, v0, tipoMov);
    }
    
});
// Llama a init() cuando cargue la página para que dibuje las masas estáticas
window.onload = init;
>>>>>>> ea612f8602f63f3793e3a4416fa9bfa0e5025bad
