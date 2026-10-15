import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDi6WyzKQLXxmxUZ4AI6SQedkU7bO4jju4",
  authDomain: "smart-colpres.firebaseapp.com",
  projectId: "smart-colpres",
  storageBucket: "smart-colpres.firebasestorage.app",
  messagingSenderId: "209617156156",
  appId: "1:209617156156:web:168d9a98dffbe76659ab39"
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);

const mockActivities = {
  "activity_1": {
    "title": "Biología: La Célula",
    "subject": "Ciencias Naturales - Sexto",
    "questions": [
      {
        "context": "La célula es la unidad morfológica y funcional de todo ser vivo. De hecho, la célula es el elemento de menor tamaño que puede considerarse vivo.",
        "text": "¿Cuál es la función principal de la mitocondria en la célula?",
        "options": [
          "Producir energía (ATP)",
          "Almacenar agua y nutrientes",
          "Realizar la fotosíntesis",
          "Proteger el núcleo"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 20
      },
      {
        "context": "Existen dos grandes tipos celulares en la naturaleza: las células procariotas y las células eucariotas.",
        "text": "¿Qué característica principal distingue a una célula eucariota de una procariota?",
        "options": [
          "Tienen membrana plasmática",
          "Poseen un núcleo definido",
          "Tienen ribosomas libres",
          "Son bacterias"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 20
      },
      {
        "context": "Las plantas tienen células con características únicas que les permiten sobrevivir sin moverse.",
        "text": "¿Qué organelo es exclusivo de las células vegetales y les permite hacer fotosíntesis?",
        "options": [
          "Ribosoma",
          "Lisosoma",
          "Cloroplasto",
          "Aparato de Golgi"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 15
      }
    ]
  },
  "activity_2": {
    "title": "Suma y resta de decimales",
    "subject": "Matemáticas - Sexto",
    "questions": [
      {
        "context": "",
        "text": "1. Un ciclista recorrió 45,5 km en la mañana y 38,25 km en la tarde. ¿Cuál es la distancia total que recorrió en el día?",
        "options": [
          "83,30 km",
          "83,75 km",
          "84,25 km",
          "73,75 km"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "2. María tiene $50,50 para gastar en la tienda escolar. Si compra un cuaderno que cuesta $12,75 y unos colores de $15,30, ¿cuánto dinero le sobra exactamente?",
        "options": [
          "$21,45",
          "$23,55",
          "$22,45",
          "$28,05"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "3. Al sumar 14,2 y 3,05, un estudiante olvidó alinear la coma y sumó mal. Si tú lo haces correctamente, ¿cuál es el resultado exacto de esta suma?",
        "options": [
          "17,25",
          "4,47",
          "14,25",
          "17,07"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "4. El récord de salto largo de un colegio es de 4,5 metros. Si Carlos logró saltar 3,18 metros, ¿cuántos metros le faltan para igualar el récord?",
        "options": [
          "1,42 m",
          "7,68 m",
          "1,38 m",
          "1,32 m"
        ],
        "correctAnswerIndex": 3,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "5. En el supermercado, una caja llena de manzanas pesa 15,4 kg. Si la caja vacía pesa 1,25 kg, ¿cuál es el peso exacto de las manzanas solas?",
        "options": [
          "14,15 kg",
          "16,65 kg",
          "14,25 kg",
          "13,15 kg"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "6. La temperatura normal de un paciente es de 36,5 grados. Si su temperatura sube 2,75 grados debido a una fiebre, ¿qué temperatura marca el termómetro ahora?",
        "options": [
          "38,25 grados",
          "39,25 grados",
          "38,75 grados",
          "39,00 grados"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "7. Un carpintero tiene una tabla de madera que mide 120 centímetros de largo. Si corta un pedazo de 45,6 centímetros, ¿cuánto mide el pedazo de madera que sobra?",
        "options": [
          "75,4 cm",
          "84,4 cm",
          "74,6 cm",
          "74,4 cm"
        ],
        "correctAnswerIndex": 3,
        "timeLimit": 30
      }
    ]
  },
  "activity_3": {
    "title": "Deportes y Decimales",
    "subject": "Matemáticas - Sexto",
    "questions": [
      {
        "context": "",
        "text": "1. Natación: En la prueba de relevos, Mariana nadó su turno en 25,4 segundos y su compañera Laura lo hizo en 26,8 segundos. ¿Cuál fue el tiempo total del equipo?",
        "options": [
          "51,2 segundos",
          "52,0 segundos",
          "52,2 segundos",
          "53,2 segundos"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "2. Salto Alto: El récord departamental de salto alto es de 2,15 metros. Si Carlos logró saltar 1,83 metros, ¿cuánto le falta para igualar el récord?",
        "options": [
          "3,98 metros",
          "0,22 metros",
          "1,32 metros",
          "0,32 metros"
        ],
        "correctAnswerIndex": 3,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "3. Levantamiento de Pesas: Un atleta necesita levantar 120,5 kilogramos para clasificar a la final. Si en su barra ya tiene puestos 105,25 kilogramos, ¿cuánto peso restante debe agregar?",
        "options": [
          "15,25 kilogramos",
          "15,75 kilogramos",
          "25,25 kilogramos",
          "225,75 kilogramos"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "4. Atletismo: Durante su entrenamiento, un corredor dio tres vueltas a diferentes circuitos: el primero de 1,25 km, el segundo de 1,5 km y el tercero de 0,75 km. ¿Qué distancia acumulada corrió en total?",
        "options": [
          "2,50 kilómetros",
          "3,50 kilómetros",
          "3,00 kilómetros",
          "4,00 kilómetros"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "5. Ciclismo: Una etapa de la Vuelta a Colombia tiene 45,8 kilómetros. Si un ciclista ya ha recorrido 23,45 kilómetros, ¿cuántos kilómetros le quedan por recorrer?",
        "options": [
          "22,45 kilómetros",
          "69,25 kilómetros",
          "22,35 kilómetros",
          "21,35 kilómetros"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "6. Gimnasio: El profesor de educación física está armando una pesa. La barra sola pesa 15,5 kilogramos y le coloca un disco de 12,25 kilogramos. ¿Cuál es el peso total del equipo que armó?",
        "options": [
          "27,75 kilogramos",
          "28,75 kilogramos",
          "27,50 kilogramos",
          "13,80 kilogramos"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "7. 100 Metros Planos: En una final muy reñida, el ganador cruzó la meta en 10,05 segundos y el segundo lugar en 9,82 segundos. ¿Cuál fue la diferencia exacta de tiempo entre los dos corredores?",
        "options": [
          "0,83 segundos",
          "0,23 segundos",
          "1,23 segundos",
          "0,13 segundos"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "8. Salto Largo: En sus dos mejores intentos, un deportista saltó 4,15 metros y luego 4,08 metros. Si el juez decide sumar ambas marcas para el puntaje final, ¿cuánto obtuvo?",
        "options": [
          "8,13 metros",
          "8,33 metros",
          "9,23 metros",
          "8,23 metros"
        ],
        "correctAnswerIndex": 3,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "9. Lanzamiento de Jabalina: La meta de lanzamiento para obtener medalla de oro es de 50,0 metros. Un atleta lanzó su jabalina a 48,35 metros. ¿Por cuántos metros perdió la medalla (cuánto le faltó)?",
        "options": [
          "2,65 metros",
          "1,35 metros",
          "1,65 metros",
          "2,35 metros"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "10. Triatlón: Un competidor terminó la prueba de natación nadando 1,5 kilómetros y luego hizo la prueba de bicicleta recorriendo 40,2 kilómetros. ¿Qué distancia llevaba recorrida hasta ese momento?",
        "options": [
          "41,7 kilómetros",
          "42,7 kilómetros",
          "41,5 kilómetros",
          "55,2 kilómetros"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      }
    ]
  },
  "activity_4": {
    "title": "Gerardo Suma y Resta",
    "subject": "Matemáticas - Sexto",
    "questions": [
      {
        "context": "Misión 1: La Calculadora",
        "text": "1) SUMA: 12,4 + 3,5",
        "options": [
          "15,9",
          "15,4",
          "16,9"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "Misión 1: La Calculadora",
        "text": "2) RESTA: 8,7 - 2,2",
        "options": [
          "6,7",
          "6,5",
          "10,9"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "Misión 1: La Calculadora",
        "text": "3) SUMA: 15,20 + 4,15",
        "options": [
          "19,35",
          "11,05",
          "19,20"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "Misión 1: La Calculadora",
        "text": "4) RESTA: 9,8 - 4,3",
        "options": [
          "14,1",
          "5,3",
          "5,5"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 30
      },
      {
        "context": "Misión 1: La Calculadora",
        "text": "5) SUMA: 5,0 + 2,5",
        "options": [
          "7,0",
          "7,5",
          "3,5"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "Misión 2: ¿Qué operación hacemos?",
        "text": "1. Carlos compró un jugo y un pan. ¿Cuánto pagó en TOTAL?",
        "options": [
          "SUMAR (+)",
          "RESTAR (-)"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "Misión 2: ¿Qué operación hacemos?",
        "text": "2. El récord es 10 metros. Juan saltó 8 metros. ¿Cuánto le FALTA?",
        "options": [
          "SUMAR (+)",
          "RESTAR (-)"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "Misión 2: ¿Qué operación hacemos?",
        "text": "3. ¿Cuál es el peso ACUMULADO de las dos cajas juntas?",
        "options": [
          "SUMAR (+)",
          "RESTAR (-)"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "Misión 2: ¿Qué operación hacemos?",
        "text": "4. Mi hermano tiene 15,5 años y yo 12,2. ¿Cuál es la DIFERENCIA?",
        "options": [
          "SUMAR (+)",
          "RESTAR (-)"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      }
    ]
  },
  "activity_5": {
    "title": "¿Aproximar o Dejar Exacto?",
    "subject": "Matemáticas - Sexto",
    "questions": [
      {
        "context": "Tu familia va a viajar de Santa Marta a Medellín por carretera. En el mapa dice que la distancia es de 845,7 kilómetros. Para calcular más o menos cuánta gasolina van a gastar, ¿qué haces con esa distancia?",
        "text": "1. El viaje familiar",
        "options": [
          "Aproximar (Decir que son unos 846 kilómetros)",
          "Dejar Exacto (Usar el 845,7 sin cambiarle nada)"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "En los Juegos Olímpicos, un nadador termina la carrera en 47,82 segundos y su rival en 47,85 segundos. Para decidir a quién le entregan la medalla de oro, el juez debe mirar los tiempos.",
        "text": "2. La medalla de oro",
        "options": [
          "Aproximar (Decir que ambos tardaron unos 48 segundos)",
          "Dejar Exacto (Usar las décimas y centésimas tal como están)"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "William necesita cambiar un tornillo del freno de su bicicleta. El manual dice que el grosor del tornillo debe ser de exactamente 0,65 centímetros para que encaje bien y sea seguro.",
        "text": "3. El repuesto de la bicicleta",
        "options": [
          "Aproximar (Comprar uno de casi 1 centímetro)",
          "Dejar Exacto (Buscar la medida de 0,65 centímetros)"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "Para la obra de teatro del colegio, necesitas comprar 3,15 metros de tela para hacer la capa de tu disfraz. En la tienda venden la tela por metros completos o medios metros.",
        "text": "4. Comprando tela",
        "options": [
          "Aproximar (Pedir 3,5 metros para que no te falte tela)",
          "Dejar Exacto (Exigirle al vendedor que corte 3,15 metros exactos)"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "El doctor le receta a un bebé un medicamento muy fuerte. En la fórmula médica dice que la enfermera debe inyectarle 1,2 mililitros de la medicina para curarlo sin causarle daño.",
        "text": "5. Dosis de medicina",
        "options": [
          "Aproximar (Ponerle 1 mililitro o 2 mililitros)",
          "Dejar Exacto (Medir los 1,2 mililitros con precisión)"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "Vas a la tienda del colegio a comprar una botella con agua y unas galletas. La calculadora del tendero dice que el total es de 3450,5 pesos. Como las monedas de 50 centavos ya no se usan, ¿qué debe hacer el tendero al cobrarte?",
        "text": "6. El pago en la tienda",
        "options": [
          "Aproximar (Cobrarte 3450 pesos)",
          "Dejar Exacto (Exigir el medio peso)"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "Un niño llega al hospital sintiéndose muy mal. La enfermera le pone el termómetro electrónico y este marca 39,8 grados centígrados de temperatura. Para escribir en su historia clínica el estado de salud, ¿qué hace el médico?",
        "text": "7. La fiebre en urgencias",
        "options": [
          "Aproximar (Decir que tiene \"unos 40 grados\")",
          "Dejar Exacto (Anotar el 39,8 porque en salud cada décima importa)"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "Un amigo te pregunta cuánto tiempo te demoras caminando desde tu casa hasta el parque de tu barrio. Tú sabes que normalmente tardas 12,45 minutos. Para responderle de forma natural, ¿qué le dices?",
        "text": "8. Tiempo de caminata",
        "options": [
          "Aproximar (\"Me demoro más o menos unos 10 o 15 minutos\")",
          "Dejar Exacto (\"Me demoro exactamente 12,45 minutos\")"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "Un ingeniero civil está construyendo un puente vehicular. Para que el puente no se caiga, la máquina debe mezclar 450,75 kilos de cemento especial.",
        "text": "9. La mezcla de cemento",
        "options": [
          "Aproximar (Echarle unos 450 kilos al ojo)",
          "Dejar Exacto (Pesar los 450,75 kilos con precisión de seguridad)"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "Tu mamá está calculando cuánta comida preparar para tu cumpleaños. Ella hizo la cuenta de lo que come cada persona y le dio que necesita comprar 4,2 pollos asados.",
        "text": "10. Invitados a la fiesta",
        "options": [
          "Aproximar (Comprar 5 pollos enteros para que nadie quede con hambre)",
          "Dejar Exacto (Pedir en el asadero 4 pollos y el 0,2 de otro pollo)"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      }
    ]
  },
  "activity_6": {
    "title": "Prueba General - Regla de Tres",
    "subject": "Matemáticas - Sexto",
    "questions": [
      {
        "context": "",
        "text": "1. (Nivel Básico - Conceptual) En un problema de regla de tres compuesta directa, intervienen tres magnitudes. Si las dos magnitudes conocidas aumentan, ¿qué debe suceder obligatoriamente con la magnitud que contiene la incógnita?",
        "options": [
          "Debe disminuir proporcionalmente.",
          "Se mantiene constante sin importar las otras dos.",
          "Debe aumentar en la misma proporción.",
          "Se debe invertir una de las fracciones para resolverlo."
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "2. (Nivel Básico - Planteamiento) En una fábrica, 4 máquinas producen 100 zapatos en 2 días. Si queremos saber cuántos zapatos producirán 6 máquinas en 5 días, ¿cuál es el planteamiento correcto de las fracciones?",
        "options": [
          "100/x = 6/4 * 5/2",
          "100/x = 4/6 * 2/5",
          "x/100 = 4/6 * 2/5",
          "100/x = 4/2 * 6/5"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "3. (Nivel Medio) Un grupo de 3 impresoras, trabajando durante 2 horas continuas, logran imprimir 10 afiches gigantes. Si se instalan 6 impresoras y se ponen a trabajar durante 4 horas, ¿cuántos afiches lograrán imprimir?",
        "options": [
          "20 afiches",
          "30 afiches",
          "25 afiches",
          "40 afiches"
        ],
        "correctAnswerIndex": 3,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "4. (Nivel Medio) Para construir un muro, 5 obreros trabajando durante 3 días logran levantar 15 metros. ¿Cuántos metros de muro levantarán 10 obreros trabajando al mismo ritmo durante 6 días?",
        "options": [
          "60 metros",
          "30 metros",
          "45 metros",
          "75 metros"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "5. (Nivel Medio) En una estación de agua, 2 bombas encendidas durante 4 horas extraen 1.000 litros de agua. Si se encienden 3 bombas idénticas durante 5 horas, ¿cuántos litros de agua lograrán extraer?",
        "options": [
          "1.500 litros",
          "2.000 litros",
          "1.875 litros",
          "1.650 litros"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "6. (Nivel Medio-Alto) En una granja, 4 vacas consumen 800 kilogramos de alimento en 2 meses. Si la granja adquiere una vaca más (ahora son 5) y se necesita alimento para 3 meses, ¿cuántos kilogramos consumirán en total?",
        "options": [
          "1.200 kilogramos",
          "1.800 kilogramos",
          "1.000 kilogramos",
          "1.500 kilogramos"
        ],
        "correctAnswerIndex": 3,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "7. (Nivel Alto) Un comité ecológico de 10 estudiantes logra recolectar 50 kg de material reciclable en 5 días de campaña. Para la próxima campaña participarán 15 estudiantes durante 8 días. ¿Cuántos kilogramos de material lograrán recolectar?",
        "options": [
          "90 kilogramos",
          "120 kilogramos",
          "150 kilogramos",
          "100 kilogramos"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "8. (Nivel Alto) Una panadería utiliza 3 hornos trabajando durante 4 horas para hornear 120 panes especiales. Si en la temporada navideña habilitan 4 hornos para que trabajen durante 5 horas, ¿cuántos panes lograrán hornear?",
        "options": [
          "200 panes",
          "180 panes",
          "240 panes",
          "150 panes"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "9. (Nivel Alto) En un taller de costura, 6 modistas trabajando durante 5 días confeccionan 300 camisas. El colegio hace un pedido grande, por lo que el taller contrata a 2 modistas más (8 en total) para trabajar durante 7 días. ¿Cuántas camisas lograrán confeccionar?",
        "options": [
          "450 camisas",
          "500 camisas",
          "480 camisas",
          "560 camisas"
        ],
        "correctAnswerIndex": 3,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "10. (Nivel Avanzado) Para preparar un terreno agrícola, 5 tractores trabajando durante 6 horas logran arar 60 hectáreas. Si la alcaldía presta tractores adicionales, sumando un total de 8 tractores que trabajarán durante 9 horas, ¿cuántas hectáreas lograrán arar?",
        "options": [
          "120 hectáreas",
          "108 hectáreas",
          "144 hectáreas",
          "160 hectáreas"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      }
    ]
  },
  "activity_7": {
    "title": "Prueba PIAR - Regla de Tres",
    "subject": "Matemáticas - Sexto",
    "questions": [
      {
        "context": "",
        "text": "1. Si tenemos MÁS niños y les damos MÁS días para comer dulces, ¿qué pasará con los dulces?",
        "options": [
          "Se comerán menos dulces.",
          "Los dulces sobrarán.",
          "Se comerán más dulces."
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "2. Un niño (1), en 1 día, se come 2 dulces. Si ahora tenemos el DOBLE de niños (2) y el DOBLE de días (2), ¿cuántos dulces se comerán?",
        "options": [
          "4 dulces.",
          "8 dulces.",
          "6 dulces."
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "3. En la granja, 2 gallinas en 2 días ponen 4 huevos. Si tenemos 4 gallinas (el doble) en 4 días (el doble), ¿cuántos huevos pondrán?",
        "options": [
          "8 huevos.",
          "12 huevos.",
          "16 huevos."
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "4. Un pintor en 1 hora logra pintar 1 pared. Si trabajan 3 pintores durante 2 horas, ¿cuántas paredes lograrán pintar?",
        "options": [
          "6 paredes.",
          "4 paredes.",
          "3 paredes."
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "5. En el parque, 2 perros jugando 1 hora se comen 4 galletas. Si los mismos 2 perros juegan durante 2 horas (el doble de tiempo), ¿cuántas galletas se comerán?",
        "options": [
          "6 galletas.",
          "8 galletas.",
          "10 galletas."
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "6. Una máquina en 1 hora fabrica 3 juguetes. Si ponemos 2 máquinas a trabajar durante 2 horas, ¿cuántos juguetes fabricarán?",
        "options": [
          "6 juguetes.",
          "9 juguetes.",
          "12 juguetes."
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "7. Un carro andando 1 hora gasta 2 galones de gasolina. Si viajan 2 carros durante 3 horas, ¿cuánta gasolina gastarán en total?",
        "options": [
          "12 galones.",
          "8 galones.",
          "6 galones."
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "8. En 1 día, 2 vacas dan 10 litros de leche. Si pasan 2 días (el doble de tiempo) con las mismas 2 vacas, ¿cuánta leche darán?",
        "options": [
          "15 litros.",
          "20 litros.",
          "30 litros."
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "9. En la clase, 2 estudiantes usando 1 caja de colores hacen 2 dibujos. Si hay 4 estudiantes usando 2 cajas de colores, ¿cuántos dibujos harán?",
        "options": [
          "8 dibujos.",
          "4 dibujos.",
          "6 dibujos."
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "10. Un árbol en 1 mes da 5 manzanas. Si sembramos 2 árboles y esperamos 2 meses, ¿cuántas manzanas recogeremos?",
        "options": [
          "10 manzanas.",
          "15 manzanas.",
          "20 manzanas."
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      }
    ]
  },
  "activity_8": {
    "title": "Regla de Tres Compuesta Inversa",
    "subject": "Matemáticas - Sexto",
    "questions": [
      {
        "context": "",
        "text": "1. (Conceptual) En un problema de regla de tres compuesta, intervienen tres magnitudes. Si al comparar la magnitud de la incógnita con las otras dos magnitudes, descubrimos que en ambos casos la relación es inversamente proporcional, ¿qué procedimiento se debe aplicar a las fracciones numéricas conocidas antes de multiplicar?",
        "options": [
          "Se deben sumar entre sí y luego igualar a la incógnita.",
          "Se escriben exactamente igual que en el planteamiento inicial.",
          "Ambas fracciones se deben invertir (intercambiar numerador y denominador).",
          "Se invierte solo la fracción de la magnitud que contiene la incógnita."
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "2. (Obras y Construcción) Un equipo de 5 obreros, trabajando 6 horas diarias, logra construir un muro perimetral en 8 días. Para un proyecto idéntico en otra sede, se contratan 10 obreros que trabajarán 8 horas diarias. ¿Cuántos días tardarán en construir el nuevo muro?",
        "options": [
          "3 días",
          "6 días",
          "12 días",
          "4 días"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "3. (Sistemas de Bombeo) En una planta de tratamiento, 4 bombas de agua trabajando 3 horas diarias logran vaciar una piscina en 5 días. Si 2 bombas entran en mantenimiento y las 2 restantes se ponen a trabajar 5 horas diarias, ¿cuántos días tardarán en vaciar la misma piscina?",
        "options": [
          "3 días",
          "6 días",
          "10 días",
          "8 días"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "4. (Consumo de Recursos) En una finca ganadera, 12 vacas consumen una ración de 5 kg de alimento diario cada una y las reservas alcanzan para 6 días. Si el granjero compra más animales y ahora tiene 15 vacas, y decide reducir la ración a 3 kg diarios por vaca, ¿para cuántos días le alcanzarán exactamente las mismas reservas de alimento?",
        "options": [
          "12 días",
          "6 días",
          "10 días",
          "8 días"
        ],
        "correctAnswerIndex": 3,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "5. (Producción Constante) El área de informática cuenta con 6 impresoras que, trabajando 4 horas diarias, tardan 5 días en imprimir todas las guías del período. Para el siguiente período, la carga de trabajo es la misma, pero solo se habilitan 4 impresoras para que trabajen 2 horas diarias. ¿Cuántos días tardarán en imprimir las guías?",
        "options": [
          "10 días",
          "8 días",
          "15 días",
          "20 días"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "6. (Campamentos Escolares) Un grupo de 4 excursionistas lleva provisiones calculadas para comer 9 raciones diarias en total, lo cual les alcanza para 10 días. Si al campamento asisten 6 excursionistas y deciden consumir solo 5 raciones diarias en total, ¿para cuántos días les alcanzarán las provisiones?",
        "options": [
          "15 días",
          "12 días",
          "9 días",
          "14 días"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      }
    ]
  },
  "activity_9": {
    "title": "Prueba PIAR - Mi Reto: ¿Más Rápido o Más Lento?",
    "subject": "Matemáticas - Sexto",
    "questions": [
      {
        "context": "1. LAS IMPRESORAS 3D. En el taller, 2 impresoras 3D están haciendo materiales táctiles y tardan 6 horas en terminar.",
        "text": "Si encendemos MÁS impresoras (4 impresoras 3D), ¿qué pasará con el tiempo de trabajo?",
        "options": [
          "Tardarán MÁS tiempo en terminar.",
          "Tardarán el MISMO tiempo.",
          "Tardarán MENOS tiempo en terminar."
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "2. EL RETO DE COCINA. En el restaurante, 1 cocinero trabajando solo tarda 10 minutos en picar las verduras.",
        "text": "Si llegan 3 cocineros más para ayudar (ahora son 4 cocineros), ¿qué pasará con el tiempo?",
        "options": [
          "Terminarán en MENOS tiempo (más rápido).",
          "Terminarán en MÁS tiempo (más lento).",
          "No podrán terminar la comida."
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "3. LIMPIANDO EL SALÓN. 2 niños limpian todo el salón de clases y se demoran 4 horas.",
        "text": "Si ahora trabajan 4 niños (el DOBLE de niños)... ¿Cuánto tiempo se demorarán?",
        "options": [
          "Se demoran 8 horas.",
          "Se demoran 2 horas (la mitad del tiempo).",
          "Se demoran 4 horas."
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "4. LA COMIDA DE LOS PERRITOS. Tenemos un bulto grande de comida. Si hay 2 perritos, la comida les alcanza para 10 días.",
        "text": "Si traemos MÁS perritos a la casa (4 perritos), ¿qué pasará con la comida?",
        "options": [
          "La comida alcanzará para MÁS días.",
          "La comida alcanzará para MENOS días (se acaba rápido).",
          "La comida alcanzará para los mismos 10 días."
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      }
    ]
  },
  "activity_10": {
    "title": "Suma y Resta Decimal y Aproximación",
    "subject": "Matemáticas - Sexto",
    "questions": [
      {
        "context": "",
        "text": "1. Carlos compra un jugo que cuesta 2,50 pesos y un pan de 1,20 pesos. ¿Cuánto debe pagar en total?",
        "options": [
          "3,50 pesos",
          "3,70 pesos",
          "1,30 pesos",
          "4,00 pesos"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "2. Una cuerda mide 5,8 metros. Si cortamos un pedazo de 2,3 metros, ¿cuántos metros quedan?",
        "options": [
          "3,5 metros",
          "8,1 metros",
          "3,8 metros",
          "2,5 metros"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "3. El récord de salto es 4,55 metros. Juan saltó 4,10 metros. ¿Cuánto le falta a Juan para igualar el récord?",
        "options": [
          "0,55 metros",
          "0,35 metros",
          "8,65 metros",
          "0,45 metros"
        ],
        "correctAnswerIndex": 3,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "4. En el mercado, una bolsa de manzanas pesa 3,4 kg y una de peras pesa 2,1 kg. ¿Cuál es el peso acumulado de ambas bolsas?",
        "options": [
          "5,5 kg",
          "1,3 kg",
          "6,5 kg",
          "5,4 kg"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "5. La temperatura en la mañana era de 24,5 grados y en la tarde subió a 28,8 grados. ¿Cuál es la diferencia de temperatura?",
        "options": [
          "4,5 grados",
          "53,3 grados",
          "4,3 grados",
          "3,3 grados"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "6. Un atleta corrió la primera vuelta en 12,4 segundos y la segunda en 11,5 segundos. ¿Cuál fue su tiempo total?",
        "options": [
          "24,9 segundos",
          "23,9 segundos",
          "0,9 segundos",
          "23,8 segundos"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "7. María tiene un billete de 20,0 dólares. Si gasta 14,5 dólares, ¿cuánto dinero le sobra?",
        "options": [
          "6,5 dólares",
          "5,0 dólares",
          "5,5 dólares",
          "34,5 dólares"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "8. Un vaso tiene 0,75 litros de agua y le agregamos 0,20 litros más. ¿Cuánta agua hay ahora?",
        "options": [
          "0,55 litros",
          "0,95 litros",
          "0,85 litros",
          "1,05 litros"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "9. La distancia a la escuela es de 4,8 km. Si ya caminé 2,5 km, ¿cuánto me falta por caminar?",
        "options": [
          "7,3 km",
          "2,2 km",
          "2,3 km",
          "1,3 km"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "10. Un albañil mezcla 15,5 kg de cemento con 10,2 kg de arena. ¿Cuánto pesa la mezcla junta?",
        "options": [
          "5,3 kg",
          "25,5 kg",
          "26,7 kg",
          "25,7 kg"
        ],
        "correctAnswerIndex": 3,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "11. El perro de Ana pesaba 12,8 kg. Después de un mes de dieta, perdió 1,5 kg. ¿Cuánto pesa ahora?",
        "options": [
          "11,3 kg",
          "14,3 kg",
          "11,8 kg",
          "10,3 kg"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "12. Un tubo de PVC mide 3,55 metros y lo queremos unir con otro de 2,15 metros. ¿Qué largo tendrá?",
        "options": [
          "5,60 metros",
          "5,70 metros",
          "1,40 metros",
          "5,80 metros"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "13. En ciclismo, el líder tiene un tiempo de 45,6 minutos y el segundo lugar 46,9 minutos. ¿Por cuánto tiempo le ganó el líder?",
        "options": [
          "1,4 minutos",
          "92,5 minutos",
          "1,3 minutos",
          "0,3 minutos"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "14. Para hacer un postre se necesitan 2,5 tazas de harina. Si ya pusimos 1,2 tazas, ¿cuántas faltan?",
        "options": [
          "3,7 tazas",
          "1,2 tazas",
          "1,3 tazas",
          "1,5 tazas"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "15. Un bebé midió 50,5 cm al nacer. En su primer mes creció 3,2 cm. ¿Cuánto mide en total?",
        "options": [
          "53,7 cm",
          "47,3 cm",
          "54,7 cm",
          "53,2 cm"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "16. Tengo un saldo en mi celular de 15,80 pesos. Hago una llamada que cuesta 3,40 pesos. ¿Cuánto saldo me queda?",
        "options": [
          "19,20 pesos",
          "12,40 pesos",
          "11,40 pesos",
          "12,80 pesos"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "17. Una mochila vacía pesa 0,8 kg. Si le metemos libros que pesan 4,5 kg, ¿cuál es el peso total?",
        "options": [
          "3,7 kg",
          "5,2 kg",
          "5,3 kg",
          "4,3 kg"
        ],
        "correctAnswerIndex": 2,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "18. La capacidad de una jarra es de 2,0 litros. Si ya contiene 1,3 litros de jugo, ¿cuánto espacio sobra?",
        "options": [
          "0,7 litros",
          "3,3 litros",
          "1,7 litros",
          "0,8 litros"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "19. Un nadador debe recorrer 100,0 metros. Si lleva nadados 65,5 metros, ¿cuántos metros le faltan?",
        "options": [
          "35,5 metros",
          "34,5 metros",
          "165,5 metros",
          "45,5 metros"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "20. En una competencia, el equipo A hizo 85,4 puntos y el equipo B hizo 80,1 puntos. ¿Cuál es la diferencia de puntos?",
        "options": [
          "5,3 puntos",
          "165,5 puntos",
          "6,3 puntos",
          "5,4 puntos"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 45
      },
      {
        "context": "",
        "text": "1. Una enfermera va a inyectar una dosis de jarabe de 2,4 mililitros a un bebé.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "2. Le cuentas a un amigo que la distancia entre Santa Marta y Bogotá por carretera es de 954,8 kilómetros.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "3. Un juez de atletismo revisa la cámara lenta porque dos corredores llegaron con tiempos de 9,81 y 9,84 segundos.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "4. Tu mamá calcula que necesita comprar 2,8 kilos de carne para un asado familiar.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "5. Un ingeniero calibra los frenos de un avión y necesita una presión de 154,67 psi para que no fallen.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "6. Vas a comprar dulces en la tienda y la cuenta da 2450,8 pesos.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "7. Un reloj suizo se está fabricando y el engranaje debe medir 0,45 centímetros para encajar.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "8. Alguien te pregunta en la calle cuánto te demoras caminando hasta el centro histórico (tardas 18,4 minutos).",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "9. En un hospital, el termómetro indica que un paciente tiene 39,7 grados de fiebre.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "10. Estás ahorrando para un videojuego y te das cuenta de que te faltan más o menos 15,800 pesos.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "11. Un científico está pesando una muestra de oro puro en el laboratorio (pesa 4,55 gramos).",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "12. Vas a comprar tela para cortinas. La ventana mide 2,15 metros, pero decides pedir un poco más para los bordes.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "13. La fórmula química para purificar el agua del colegio requiere 1,05 litros de cloro.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "14. El pronóstico del clima dice que mañana la temperatura máxima será de 31,4 grados centígrados.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "15. Un carpintero necesita que la puerta quede perfecta en el marco, dejando un margen de solo 0,2 centímetros.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "16. En tu clase de Educación Física, mides la altura de tus compañeros para una tarea (ej. 1,56 metros).",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "17. Una nave espacial debe encender sus motores durante 4,25 segundos exactos para entrar en órbita.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "18. Calculas que la película de cine va a durar 2,2 horas.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "19. En una competencia de natación, el récord mundial se rompió por 0,05 segundos.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 0,
        "timeLimit": 30
      },
      {
        "context": "",
        "text": "20. Estás llenando globos de agua para jugar y calculas que cada uno lleva unos 0,5 litros.",
        "options": [
          "Exacto",
          "Aproxima"
        ],
        "correctAnswerIndex": 1,
        "timeLimit": 30
      }
    ]
  },
  "activity_11": {
  "title": "Taller DUA: Suma y Resta",
  "subject": "Matemáticas - Sexto",
  "questions": [
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "1. Luis tiene 4,5 pesos y gana 2,1 pesos más. ¿Cuánto tiene en TOTAL?",
      "options": [
        "6,6",
        "2,4",
        "6,1"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "2. Una tabla mide 9,8 metros. Cortamos 3,5 metros. ¿Cuánto QUEDA?",
      "options": [
        "13,3",
        "6,3",
        "6,8"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "3. El peso de una caja es 12,2 kg y otra pesa 5,5 kg. ¿Cuánto pesan JUNTAS?",
      "options": [
        "17,7",
        "6,7",
        "17,2"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "4. Carlos saltó 4,8 metros y el récord es 5,9 metros. ¿Cuánto le FALTA?",
      "options": [
        "10,7",
        "1,1",
        "1,9"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "5. Compré un jugo por 2,5 pesos y un pan por 1,4 pesos. ¿Cuál es el TOTAL?",
      "options": [
        "1,1",
        "3,5",
        "3,9"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "6. Tenía 15,5 litros de agua y derramé 4,2 litros. ¿Cuánta agua SOBRA?",
      "options": [
        "11,3",
        "19,7",
        "11,5"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "7. Un perro pesa 10,4 kg y un gato 3,2 kg. ¿Cuál es el peso ACUMULADO?",
      "options": [
        "13,6",
        "7,2",
        "13,4"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "8. La meta es 20,5 km. Llevo 10,2 km. ¿Cuánto me FALTA por correr?",
      "options": [
        "30,7",
        "10,3",
        "10,5"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "9. Ayer llovió 3,1 mm y hoy 2,6 mm. ¿Cuánto llovió en TOTAL?",
      "options": [
        "0,5",
        "5,7",
        "5,1"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "10. Un árbol medía 8,7 metros. El viento le rompió 1,5 metros. ¿Cuánto MIDE ahora?",
      "options": [
        "10,2",
        "7,7",
        "7,2"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "11. Mezclamos 4,3 kg de arena con 2,4 kg de cemento. ¿Cuánto pesa la mezcla COMPLETA?",
      "options": [
        "6,7",
        "1,9",
        "6,3"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "12. Un pasaje cuesta 4,5 pesos. Pagué con 5,8 pesos. ¿Cuánto es mi VUELTO (lo que sobra)?",
      "options": [
        "1,3",
        "10,3",
        "1,5"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "13. Mi cuaderno pesa 1,2 kg y mi libro 2,5 kg. ¿Cuánto peso LLEVO en la maleta?",
      "options": [
        "1,3",
        "3,7",
        "3,2"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "14. El bus recorre 45,5 km. Ya avanzó 20,3 km. ¿Cuánto le FALTA?",
      "options": [
        "65,8",
        "25,5",
        "25,2"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "Misión 1: Detectives de Palabras",
      "text": "15. María durmió 7,2 horas y luego una siesta de 1,5 horas. ¿Cuánto durmió en TOTAL?",
      "options": [
        "8,7",
        "5,7",
        "8,2"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "16. Calcula: 4,5 + 2,3",
      "options": [
        "6,8",
        "2,2",
        "7,8"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "17. Calcula: 8,9 - 3,5",
      "options": [
        "6,4",
        "12,4",
        "5,4"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "18. Calcula: 12,4 + 5,2",
      "options": [
        "7,2",
        "17,6",
        "18,6"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "19. Calcula: 9,7 - 4,1",
      "options": [
        "5,6",
        "13,8",
        "6,6"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "20. Calcula: 6,1 + 3,8",
      "options": [
        "2,3",
        "9,9",
        "10,9"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "21. Calcula: 15,8 - 4,5",
      "options": [
        "11,3",
        "20,3",
        "12,3"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "22. Calcula: 20,3 + 14,5",
      "options": [
        "35,8",
        "5,8",
        "34,8"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "23. Calcula: 7,6 - 2,2",
      "options": [
        "9,8",
        "5,4",
        "6,4"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "24. Calcula: 9,2 + 8,6",
      "options": [
        "17,8",
        "18,8",
        "0,6"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "25. Calcula: 14,9 - 11,4",
      "options": [
        "3,5",
        "26,3",
        "4,5"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "26. Calcula: 5,5 + 3,4",
      "options": [
        "9,9",
        "2,1",
        "8,9"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "27. Calcula: 18,7 - 6,3",
      "options": [
        "25,0",
        "12,4",
        "13,4"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "28. Calcula: 1,8 + 4,1",
      "options": [
        "6,9",
        "-2,3",
        "5,9"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "29. Calcula: 25,6 - 12,3",
      "options": [
        "14,3",
        "37,9",
        "13,3"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "Misión 2: La Calculadora Humana",
      "text": "30. Calcula: 8,0 + 7,9",
      "options": [
        "16,9",
        "0,1",
        "15,9"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    }
  ]
},
  "activity_12": {
  "title": "EVALUACIÓN ACUMULATIVA: REGLA DE TRES INVERSA",
  "subject": "Matemáticas - Séptimo",
  "questions": [
    {
      "context": "",
      "text": "1. ¿Qué característica define a dos magnitudes que son inversamente proporcionales?",
      "options": [
        "Ambas magnitudes aumentan en la misma proporción.",
        "Si una magnitud aumenta, la otra disminuye en la misma proporción.",
        "Ambas magnitudes disminuyen constantemente.",
        "No existe relación matemática entre ellas."
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "2. Al plantear una regla de tres simple inversa, ¿qué procedimiento se debe aplicar a las razones numéricas antes de despejar la incógnita?",
      "options": [
        "Se suman los numeradores y denominadores.",
        "Se igualan las razones directamente.",
        "Se debe invertir la razón de los valores conocidos.",
        "Se restan los valores de la magnitud desconocida."
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "3. ¿Cuál de los siguientes pares de magnitudes es un ejemplo de proporcionalidad inversa?",
      "options": [
        "Cantidad de artículos comprados y precio total a pagar.",
        "Velocidad de un vehículo y el tiempo empleado en recorrer una distancia.",
        "Número de hojas de un libro y su peso.",
        "Horas de estudio y cantidad de temas aprendidos."
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "4. En una regla de tres inversa, si la magnitud A se duplica, ¿qué le ocurre obligatoriamente a la magnitud B?",
      "options": [
        "Se reduce a la mitad.",
        "Se duplica también.",
        "Se reduce a una tercera parte.",
        "Se mantiene constante."
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "5. Si la cantidad de obreros en una construcción disminuye a la tercera parte, ¿qué pasará con el tiempo de entrega de la obra?",
      "options": [
        "Disminuirá a la tercera parte.",
        "Se triplicará.",
        "Aumentará solo un día.",
        "No se verá afectado."
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "6. Un ciclista viaja a 40 km/h y tarda 3 horas en llegar. Si aumenta su velocidad a 60 km/h, ¿qué proporción representa correctamente la situación inversa?",
      "options": [
        "40/60 = x/3",
        "40/60 = 3/x",
        "60/40 = 3/x",
        "x/40 = 60/3"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "7. En un establo, 12 caballos tienen alimento para 15 días. Si se venden 4 caballos (quedan 8), ¿qué magnitud permanece constante en este problema?",
      "options": [
        "El número de caballos.",
        "El número de días.",
        "La cantidad total de alimento disponible.",
        "La ración diaria de cada caballo."
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "8. Para pintar un edificio, 5 pintores tardan 20 días. ¿Cómo se plantea matemáticamente la ecuación para hallar el tiempo que tardarían 10 pintores?",
      "options": [
        "x = (10 * 20) / 5",
        "x = (5 * 20) / 10",
        "x = (5 * 10) / 20",
        "x = 20 / (5 * 10)"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "9. Una llave vierte 15 litros por minuto y llena un tanque en 40 minutos. Si otra llave vierte 20 litros por minuto, ¿es este un problema de regla de tres directa o inversa?",
      "options": [
        "Inversa, porque a mayor flujo de agua, menor tiempo de llenado.",
        "Directa, porque a mayor flujo, más agua entra.",
        "Inversa, porque los litros no importan.",
        "Directa, porque a mayor tiempo, mayor flujo."
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "10. Se plantea: 4 máquinas hacen un trabajo en 12 horas. 6 máquinas lo hacen en 'x' horas. Al aplicar la propiedad fundamental, la ecuación correcta es:",
      "options": [
        "6 * 12 = 4 * x",
        "4 * x = 6 + 12",
        "4 * 12 = 6 * x",
        "x * 12 = 4 * 6"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "11. 3 obreros tardan 12 horas en reparar un tejado. ¿Cuántas horas tardarían 4 obreros trabajando al mismo ritmo?",
      "options": [
        "9 horas",
        "16 horas",
        "8 horas",
        "10 horas"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "12. Un camión realiza un viaje en 6 horas a una velocidad de 80 km/h. ¿A qué velocidad debe ir para realizar el mismo viaje en 4 horas?",
      "options": [
        "100 km/h",
        "110 km/h",
        "120 km/h",
        "90 km/h"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "13. En un campamento, 45 estudiantes tienen provisiones para 20 días. Si llegan 15 estudiantes más, ¿para cuántos días alcanzarán las provisiones?",
      "options": [
        "12 días",
        "15 días",
        "18 días",
        "10 días"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "14. 8 impresoras imprimen el material del colegio en 3 horas. Si se dañan 2 impresoras, ¿cuánto tiempo tardarán las restantes en imprimir el mismo material?",
      "options": [
        "5 horas",
        "4 horas",
        "3,5 horas",
        "6 horas"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "15. Un ganadero tiene pasto para alimentar 20 vacas durante 30 días. Si decide comprar 10 vacas más, ¿cuántos días le durará el pasto?",
      "options": [
        "25 días",
        "20 días",
        "15 días",
        "45 días"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "16. Para envasar la producción de aceite se utilizaron 120 envases de 2 litros de capacidad. ¿Cuántos envases de 5 litros se habrían necesitado para envasar la misma cantidad?",
      "options": [
        "50 envases",
        "60 envases",
        "40 envases",
        "48 envases"
      ],
      "correctAnswerIndex": 3,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "17. Una piscina se llena en 15 horas utilizando 4 grifos de igual flujo. ¿Cuántos grifos se necesitarán para llenar la misma piscina en 6 horas?",
      "options": [
        "10 grifos",
        "8 grifos",
        "12 grifos",
        "6 grifos"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "18. Un equipo de 6 desarrolladores programa una aplicación en 24 días. Si la empresa desea lanzar la aplicación en 18 días, ¿cuántos desarrolladores en total se necesitan?",
      "options": [
        "9 desarrolladores",
        "7 desarrolladores",
        "8 desarrolladores",
        "10 desarrolladores"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "19. Si 15 obreros asfaltan una calle en 14 días, ¿cuántos días tardarían 21 obreros en realizar la misma obra?",
      "options": [
        "10 días",
        "8 días",
        "12 días",
        "9 días"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "20. Al leer un libro de 300 páginas a un ritmo de 20 páginas diarias, se termina en 15 días. Si se desea terminar el libro en 12 días, ¿cuántas páginas diarias se deben leer?",
      "options": [
        "25 páginas",
        "30 páginas",
        "22 páginas",
        "28 páginas"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "21. Un grupo de amigos alquila una casa por $1.200.000. Si asisten 8 amigos, cada uno paga una cuota. Si a última hora deciden ir solo 6 amigos, ¿cuánto aumenta la cuota de cada uno?",
      "options": [
        "Aumenta $50.000",
        "Aumenta $20.000",
        "Aumenta $40.000",
        "Aumenta $10.000"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "22. En un batallón, 400 soldados tienen raciones para 60 días. Luego de 10 días, llegan 100 soldados más. ¿Para cuántos días más alcanzarán las raciones restantes?",
      "options": [
        "35 días",
        "40 días",
        "30 días",
        "45 días"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "23. Se contratan 12 máquinas para limpiar un terreno en 30 días. Si después de 6 días de trabajo se retiran 3 máquinas, ¿cuántos días más se demorarán en terminar respecto al plan original?",
      "options": [
        "8 días más",
        "6 días más",
        "10 días más",
        "4 días más"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "24. Una rueda de 40 dientes engrana con otra de 25 dientes. Si la primera rueda da 50 vueltas por minuto, ¿cuántas vueltas por minuto dará la segunda rueda?",
      "options": [
        "75 vueltas",
        "60 vueltas",
        "80 vueltas",
        "90 vueltas"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "25. Para recorrer una distancia, un tren bala que viaja a 240 km/h tarda 2,5 horas. ¿Cuánto tardará un tren convencional que viaja a 150 km/h?",
      "options": [
        "5 horas",
        "4,5 horas",
        "3,5 horas",
        "4 horas"
      ],
      "correctAnswerIndex": 3,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "26. Un depósito de agua abastece a 60 familias durante 25 días a razón de 400 litros por familia. Si el número de familias aumenta a 75 y la ración se mantiene igual, ¿en cuántos días se agotará el agua?",
      "options": [
        "20 días",
        "18 días",
        "22 días",
        "15 días"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "27. Un contratista calcula que con 18 operarios terminará un puente en 45 días. Si el plazo del contrato se reduce a 30 días, ¿cuántos operarios adicionales deberá contratar?",
      "options": [
        "27 operarios",
        "12 operarios",
        "9 operarios",
        "15 operarios"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "28. Un grifo con un caudal de 12 litros por minuto llena un tanque en 4,5 horas. Si se cambia por un grifo con un caudal de 15 litros por minuto, ¿cuánto tiempo ahorrará en llenar el tanque?",
      "options": [
        "0,5 horas",
        "1,5 horas",
        "0,9 horas",
        "1,2 horas"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "29. Para embalar cajas, una máquina empacadora a una velocidad de 60 cajas por minuto tarda 8 horas. Si por fallas técnicas su velocidad disminuye a 48 cajas por minuto, ¿cuántas horas tardará?",
      "options": [
        "10 horas",
        "12 horas",
        "9 horas",
        "11 horas"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 45
    },
    {
      "context": "",
      "text": "30. En una expedición, 6 científicos tienen víveres para 15 días. Antes de iniciar, 1 científico se enferma y no viaja. ¿En qué porcentaje aproximado aumentará la duración de los víveres para los científicos restantes?",
      "options": [
        "15%",
        "25%",
        "20%",
        "10%"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 45
    }
  ]
},
  "activity_13": {
  "title": "TALLER CALIFICATIVO: ÁLGEBRA 7°",
  "subject": "Matemáticas - Séptimo",
  "questions": [
    {
      "context": "",
      "text": "1. En el término −8x³, sus elementos son:",
      "options": [
        "Coeficiente: 8, Variable: x, Exponente: −3",
        "Coeficiente: 3, Variable: x, Exponente: −8",
        "Coeficiente: −8, Variable: x, Exponente: 3",
        "Coeficiente: −8, Variable: 3, Exponente: x"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "2. Analiza el término 14y. ¿Cuáles son sus elementos?",
      "options": [
        "Coeficiente: 14, Variable: y, Exponente: 1",
        "Coeficiente: 14, Variable: y, Exponente: 0",
        "Coeficiente: 1, Variable: y, Exponente: 14",
        "Coeficiente: y, Variable: 14, Exponente: 1"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "3. Determina los elementos del término −m⁴:",
      "options": [
        "Coeficiente: 0, Variable: m, Exponente: 4",
        "Coeficiente: −4, Variable: m, Exponente: 1",
        "Coeficiente: 1, Variable: m, Exponente: −4",
        "Coeficiente: −1, Variable: m, Exponente: 4"
      ],
      "correctAnswerIndex": 3,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "4. Observa el término algebraico «a». Sus partes correctas son:",
      "options": [
        "Coeficiente: 0, Variable: a, Exponente: 0",
        "Coeficiente: 1, Variable: a, Exponente: 1",
        "Coeficiente: 1, Variable: a, Exponente: 0",
        "Coeficiente: a, Variable: 1, Exponente: 1"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "5. En el término 5z², ¿cuál afirmación es verdadera?",
      "options": [
        "La variable es 5 y el exponente es 2.",
        "El coeficiente es 2 y la variable es z.",
        "El coeficiente es 5 y el exponente es 2.",
        "El exponente es z y el coeficiente es 5."
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "6. ¿La expresión 3x² − 5/x + 2 es un polinomio?",
      "options": [
        "Sí, porque tiene tres términos.",
        "No, porque hay una variable (x) en el denominador.",
        "Sí, porque todos los números son enteros.",
        "No, porque el primer término tiene un exponente muy alto."
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "7. Analiza la expresión 4y³ − 2y² + 8:",
      "options": [
        "Sí es un polinomio, ya que todas las variables tienen exponentes enteros positivos.",
        "No es un polinomio, porque tiene un número solo (el 8).",
        "No es un polinomio, porque tiene un coeficiente negativo (−2).",
        "Sí es un polinomio, pero está incompleto porque le falta la letra x."
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "8. ¿La expresión 7√x + x² cumple con las reglas de un polinomio?",
      "options": [
        "Sí, porque es un binomio.",
        "Sí, la raíz cuadrada no afecta a los polinomios.",
        "No, porque le falta un término independiente.",
        "No, porque la variable (x) se encuentra dentro de una raíz."
      ],
      "correctAnswerIndex": 3,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "9. Observa la expresión x⁴ − 5x⁻² + 1. Determina su clasificación:",
      "options": [
        "Es un polinomio ordenado.",
        "Es un polinomio porque tiene tres términos.",
        "No es un polinomio porque posee un exponente negativo (−2).",
        "No es un polinomio porque el primer término no tiene coeficiente visible."
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "10. Evalúa la siguiente expresión matemática: 6a²b + 3ab − 5",
      "options": [
        "No es polinomio porque mezcla dos letras distintas (a y b).",
        "No es polinomio por tener un término independiente negativo.",
        "Sí es polinomio, pero está mal escrito.",
        "Sí es polinomio, es un trinomio válido con exponentes enteros positivos."
      ],
      "correctAnswerIndex": 3,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "11. ¿La expresión x³/4 + 2x − 1 es un polinomio válido?",
      "options": [
        "No, porque las fracciones están prohibidas en los polinomios.",
        "Sí, porque el denominador es un número y la variable está arriba con exponente positivo.",
        "No, porque la variable x está dividiendo al 4.",
        "Sí, pero solo si multiplicamos todo por 4."
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "12. En el polinomio 3x⁴y² − 5x²y⁶ + y, ¿cuál es el Grado Relativo respecto a la variable \"y\" (GRy)?",
      "options": [
        "6",
        "2",
        "1",
        "4"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "13. Dado el polinomio 7a³b²c⁵ − a⁴b⁴c², determina el Grado Relativo respecto a la variable \"a\" (GRa):",
      "options": [
        "7",
        "3",
        "4",
        "5"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "14. En la expresión −2m⁵n³ + 8m²n⁷ − m⁸n, ¿cuál es el Grado Relativo respecto a \"m\" (GRm)?",
      "options": [
        "5",
        "8",
        "2",
        "7"
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 60,
      "section": "Expresiones Algebraicas"
    },
    {
      "context": "",
      "text": "15. Calcula el Grado Absoluto (GA) del polinomio 4x³ − 2x⁵ + 7x:",
      "options": [
        "3",
        "9",
        "7",
        "5"
      ],
      "correctAnswerIndex": 3,
      "timeLimit": 60,
      "section": "Polinomios"
    },
    {
      "context": "",
      "text": "16. ¿Cuál es el Grado Absoluto (GA) del polinomio 3a²b³ − 5a⁴b² + 8ab?",
      "options": [
        "6",
        "5",
        "4",
        "2"
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 60,
      "section": "Polinomios"
    },
    {
      "context": "",
      "text": "17. Determina el Grado Absoluto (GA) del polinomio −m⁵n⁴ + 2m³n⁷ − m²n⁵:",
      "options": [
        "9",
        "7",
        "10",
        "8"
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 60,
      "section": "Polinomios"
    },
    {
      "context": "",
      "text": "18. Analiza el polinomio 4x³ − 2x² + 5x − 1. ¿Qué afirmación lo describe mejor?",
      "options": [
        "Es un polinomio ordenado, pero incompleto.",
        "Es un polinomio completo y ordenado de forma descendente.",
        "Es un polinomio completo, pero desordenado.",
        "Es un polinomio ordenado de forma ascendente."
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 60,
      "section": "Polinomios"
    },
    {
      "context": "",
      "text": "19. Observa el polinomio x⁴ + 2x² − 3. Su clasificación correcta es:",
      "options": [
        "Completo y ordenado.",
        "Desordenado e incompleto.",
        "Ordenado en forma descendente, pero incompleto.",
        "Completo, pero desordenado."
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 60,
      "section": "Polinomios"
    },
    {
      "context": "",
      "text": "20. El polinomio 5x − x³ + 2x² − 8 se caracteriza por ser:",
      "options": [
        "Completo (tiene todos los grados desde el 3 hasta el 0), pero está desordenado.",
        "Incompleto y desordenado.",
        "Ordenado y completo.",
        "Incompleto, aunque está ordenado."
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 60,
      "section": "Polinomios"
    },
    {
      "context": "",
      "text": "21. ¿Qué características cumple el polinomio y³ − 5y⁵ + y?",
      "options": [
        "Es completo y ordenado.",
        "Es completo, pero desordenado.",
        "Es ordenado de forma descendente.",
        "No es completo (faltan grados 4, 2 y 0) y tampoco está ordenado."
      ],
      "correctAnswerIndex": 3,
      "timeLimit": 60,
      "section": "Polinomios"
    },
    {
      "context": "",
      "text": "22. Analiza el polinomio −7 + 2m − 3m² + m³:",
      "options": [
        "Es incompleto y desordenado.",
        "Es completo, pero ordenado descendentemente.",
        "Es completo y está ordenado de forma ascendente.",
        "Es ordenado, pero le falta el término independiente."
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 60,
      "section": "Polinomios"
    },
    {
      "context": "",
      "text": "23. El polinomio a⁵ − 2a⁴ + 3a³ puede clasificarse como:",
      "options": [
        "Completo y ordenado.",
        "Ordenado descendentemente, pero incompleto.",
        "Incompleto y desordenado.",
        "Completo, pero desordenado."
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 60,
      "section": "Polinomios"
    },
    {
      "context": "",
      "text": "24. ¿Son semejantes los términos 4x²y y −5x²y?",
      "options": [
        "Sí, porque tienen las mismas letras con los mismos exponentes.",
        "No, porque tienen coeficientes con signos diferentes.",
        "No, porque el 4 y el 5 son números distintos.",
        "Sí, porque ambos son términos algebraicos."
      ],
      "correctAnswerIndex": 0,
      "timeLimit": 60,
      "section": "Polinomios"
    },
    {
      "context": "",
      "text": "25. Analiza los términos 3m³n² y 3m²n³. ¿Son semejantes?",
      "options": [
        "Sí, porque ambos tienen el coeficiente 3.",
        "Sí, porque usan las mismas letras (m y n).",
        "No, porque los exponentes están intercambiados en las letras.",
        "No, porque a uno de los dos le falta un signo negativo."
      ],
      "correctAnswerIndex": 2,
      "timeLimit": 60,
      "section": "Polinomios"
    },
    {
      "context": "",
      "text": "26. ¿La pareja de términos 7ab² y −ab² es semejante?",
      "options": [
        "No, porque el segundo término no tiene número visible.",
        "No, porque los signos son opuestos.",
        "Sí, porque la variable 'a' no tiene exponente en ninguno.",
        "Sí, porque ambos comparten exactamente la parte literal (ab²)."
      ],
      "correctAnswerIndex": 3,
      "timeLimit": 60,
      "section": "Polinomios"
    },
    {
      "context": "",
      "text": "27. ¿Son semejantes los términos 8x y 8y?",
      "options": [
        "Sí, porque ambos tienen el mismo coeficiente (8).",
        "No, porque tienen letras (variables) diferentes.",
        "Sí, porque las letras no tienen exponentes escritos.",
        "No, porque uno debería ser negativo."
      ],
      "correctAnswerIndex": 1,
      "timeLimit": 60,
      "section": "Polinomios"
    }
  ]
}
};

async function syncDB() {
  try {
    await set(ref(rtdb, 'activities'), mockActivities);
    console.log("Database successfully synced with all activities!");
    process.exit(0);
  } catch (error) {
    console.error("Error syncing DB:", error);
    process.exit(1);
  }
}

syncDB();
