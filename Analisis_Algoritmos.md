# Análisis de Rendimiento de Algoritmos de Ordenamiento y Búsqueda

**Institución:** Universidad Autónoma de Zacatecas (UAZ)  
**Unidad Académica:** Ingeniería Eléctrica - Programa de Ingeniería de Software  
**Materia:** Análisis y Diseño de Algoritmos  
**Estudiante:** Luis Diego  
**Herramienta de Prueba:** VisuAlgo.net  

---

## 1. Metodología de las Pruebas
Para garantizar una comparación equitativa, todos los algoritmos fueron sometidos a las mismas condiciones de prueba:
* **Tamaño del arreglo ($N$):** 10 elementos.
* **Estado inicial:** Entradas aleatorias desordenadas.
* **Velocidad de ejecución:** 1x (Velocidad base de animación).
* **Objetivo:** Medir el tiempo relativo y la eficiencia visual de cada implementación.

---

## 2. Reportes Individuales por Caso

### Caso 1: Bubble Sort (Ordenamiento Burbuja)
* **Definición:** Algoritmo de ordenamiento por intercambio que compara elementos adyacentes y los permuta si están en el orden incorrecto.
* **Comportamiento en 1x:** Es el más lento de todos. Se observa un movimiento constante y repetitivo; los elementos más grandes "flotan" hacia el final muy lentamente.
* **Ventajas:** Extremadamente sencillo de entender e implementar.
* **Desventajas:** Realiza un número excesivo de comparaciones e intercambios innecesarios.
* **Complejidad:** $O(n^2)$

### Caso 2: Binary Search (Búsqueda Binaria)
* **Definición:** Algoritmo de búsqueda que localiza un elemento dividiendo repetidamente a la mitad el rango de búsqueda.
* **Comportamiento en 1x:** Es el más rápido en ejecución, aunque **requiere que el arreglo esté previamente ordenado**. Encuentra el dato en apenas 3 o 4 pasos para un arreglo de 10 elementos.
* **Ventajas:** Eficiencia logarítmica superior para grandes volúmenes de datos.
* **Desventajas:** No funciona en arreglos desordenados.
* **Complejidad:** $O(\log n)$

### Caso 3: Insertion Sort (Ordenamiento por Inserción)
* **Definición:** Construye el arreglo final un elemento a la vez, insertándolo en la posición correcta dentro de la parte ya ordenada.
* **Comportamiento en 1x:** Velocidad moderada. Es visualmente más eficiente que Bubble Sort cuando el arreglo tiene cierto grado de orden previo.
* **Ventajas:** Muy eficiente para listas pequeñas o datos que ya están "casi" ordenados.
* **Desventajas:** Sigue siendo ineficiente para arreglos grandes comparado con algoritmos avanzados.
* **Complejidad:** $O(n^2)$

### Caso 4: Merge Sort (Ordenamiento por Mezcla)
* **Definición:** Algoritmo basado en "Divide y Vencerás" que divide el arreglo en mitades y luego las fusiona de forma ordenada.
* **Comportamiento en 1x:** Muy rápido y constante. La animación muestra una división lógica clara seguida de una fusión eficiente.
* **Ventajas:** Garantiza un rendimiento estable independientemente de cómo estén los datos iniciales.
* **Desventajas:** Requiere memoria adicional para realizar la mezcla de los sub-arreglos.
* **Complejidad:** $O(n \log n)$

### Caso 5: Quick Sort (Ordenamiento Rápido)
* **Definición:** Utiliza un elemento "pivote" para particionar el arreglo en dos sub-grupos (menores y mayores al pivote).
* **Comportamiento en 1x:** El más veloz de los algoritmos de ordenamiento. Los elementos saltan a sus posiciones finales con gran rapidez.
* **Ventajas:** Es el algoritmo más rápido en la práctica para la mayoría de las situaciones.
* **Desventajas:** En el peor de los casos (si el pivote es malo), puede ser lento.
* **Complejidad:** $O(n \log n)$ (Promedio)

### Caso 6: Selection Sort (Ordenamiento por Selección)
* **Definición:** Busca repetidamente el elemento mínimo de la sección no ordenada y lo coloca al principio.
* **Comportamiento en 1x:** Muy lento en comparaciones, pero rápido en intercambios (solo hace uno por cada pasada externa).
* **Ventajas:** Realiza el mínimo número de intercambios de memoria posibles.
* **Desventajas:** Siempre tarda lo mismo, incluso si el arreglo ya está ordenado.
* **Complejidad:** $O(n^2)$

---

## 3. Tabla Comparativa de Rendimiento

| Algoritmo | Tiempo en 1x (Relativo) | Tipo de Operación | Estabilidad |
| :--- | :--- | :--- | :--- |
| **Búsqueda Binaria** | ⚡ Ultra Rápido | Búsqueda | N/A |
| **Quick Sort** | 🚀 Muy Rápido | Ordenamiento | Inestable |
| **Merge Sort** | 🚄 Rápido | Ordenamiento | Estable |
| **Insertion Sort** | 🐢 Moderado | Ordenamiento | Estable |
| **Selection Sort** | 🐌 Muy Lento | Ordenamiento | Inestable |
| **Bubble Sort** | 🧱 El más lento | Ordenamiento | Estable |

---

## 4. Conclusión Formal

Tras realizar las pruebas de rendimiento en el entorno de simulación **VisuAlgo** con una velocidad de ejecución constante de **1x**, se concluye que existe una correlación directa entre la complejidad algorítmica y el tiempo de respuesta visual. 

Los algoritmos de tipo cuadrático ($O(n^2)$), como **Bubble, Selection e Insertion Sort**, demostraron ser pedagógicamente valiosos por su lógica intuitiva, pero resultan ineficientes para el escalamiento de datos debido al alto número de comparaciones e intercambios requeridos. Por el contrario, los algoritmos basados en la estrategia de "Divide y Vencerás" ($O(n \log n)$), como **Merge y Quick Sort**, exhibieron una optimización superior, reduciendo drásticamente los pasos de ejecución.

Finalmente, se determinó que la **Búsqueda Binaria** representa la máxima eficiencia en recuperación de información ($O(\log n)$), subrayando la importancia crítica de contar con un arreglo previamente ordenado. En la práctica de la Ingeniería de Software, la elección del algoritmo debe basarse en un balance entre la estructura de los datos, los recursos de memoria y la velocidad de procesamiento requerida.