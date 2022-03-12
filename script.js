'use strict'

let textArea = document.getElementById("edgesInp"),
    bt_submit = document.getElementById("submit"),
    result_box = document.getElementById("result");



//Take data
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function takeEdgesAndVertexes(arr) {
    let edgsArray = arr.split(",").map(item => parseInt(item)),
        vertex, edges, reverseEdges

    edges = edgsArray.reduce(function(result, value, index, array) {
        if (index % 2 === 0)
            result.push(array.slice(index, index + 2));
        return result;
    }, []);
    reverseEdges = reverseEnges(edges)
    edges.push(...reverseEdges)
    vertex = edgsArray.filter((value, index, self) => { return self.indexOf(value) === index })

    return { edges, vertex }
}

//Side functions 
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function findEdges(v, edg) {
    return edg.filter((x) => {
        if (x[0] == v) {
            return x
        } else false
    })
}

//chooise a random vertex from eges
function randomVertex(array) {
    if (array.length > 0) {
        return array[Math.floor(Math.random() * array.length)][0]
    } else { return false }
}

//reverse the closed path
function reverseEnges(list) {
    let res = []
    list.map(item => {
        let a = [...item],
            b = []

        b.push(a[1])
        b.push(a[0])

        res.push(b)
    })
    return res

}

//Compute the degree of every vertex/check if there is a Euler circuit 
function degreeNumber(vert, edg) {
    let eulerC = true;
    for (let j = 0; j < vert.length; j++) {
        (findEdges(j, edg).length % 2 !== 0) ? eulerC = false: 0;
    }
    return eulerC;
}



//Compute the degree of every vertex/check if there is a Euler circuit 
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Creating a Closed Path
function findClosedPath(start, graph) {
    if (!start) return false

    let stop = true,
        arr = [],
        next_vertex = start,
        edges_array = graph

    do {
        let edges_v = []
        if (edges_array.length > 0) {
            edges_v = findEdges(next_vertex, edges_array)

            let old_edge = edges_v[0],
                old_reverse = [old_edge[1], old_edge[0]]
            next_vertex = old_edge[1]

            edges_array = graph.filter(function(f) {
                return f[0] !== old_edge[0] || f[1] !== old_edge[1]
            }).filter(function(r) {
                return r[1] !== old_edge[0] || r[0] !== old_edge[1]
            })

            for (let i = 0; i < edges_v.length; i++) {

                if (!(arr.includes(old_edge) || arr.includes(old_reverse))) {
                    arr.push(old_edge)
                    if (edges_v[i][1] == start) {
                        stop = false

                    }
                }
            }
        }
    } while (stop)

    return arr
}


//Substract a Closed Path from initial edges array
function substractClosedPath(list, data) {
    if (!list) return false

    let reverseList = reverseEnges(list)
    let result = [],
        con = false,
        minusfirst = data.filter(item => !(list.includes(item)))

    for (let j = 0; j < minusfirst.length; j++) {
        for (let i = 0; i < reverseList.length; i++) {
            if (JSON.stringify(reverseList[i]) === JSON.stringify(minusfirst[j])) {
                con = true
            }
        }
        if (!con) result.push(minusfirst[j])
        con = false
    }
    return result
}


//Create the final result
function pushCircuit(eulerCirc, additionalCirc) {
    let result = []

    if (eulerCirc.length == 0) {
        result.push(...additionalCirc)
        return result
    } else {
        if (additionalCirc != false) {
            for (let i = 0; i < eulerCirc.length - 1; i++) {
                if (eulerCirc[i][1] == additionalCirc[0][0] && eulerCirc[i + 1][0] == additionalCirc[0][0]) {
                    result = [...eulerCirc.slice(0, i + 1), ...additionalCirc, ...eulerCirc.slice(i + 1, eulerCirc.length)]
                    return result
                }
            }
        }
        if (result.length == 0 && additionalCirc != false) {
            result.push(...eulerCirc)
            result.push(...additionalCirc)
            return result
        }
    }
}




//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Main Euler Circuit Function/algoritm
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function eulerCircuitComputing(vArray, data) {
    let edgesArray_G_C = data,
        simpleClosedPath_C = [],
        v, simpleClosedPath,
        isEvenDegree = degreeNumber(vArray, data) //Check if all vertices have even degree

    if (!isEvenDegree) {
        result_box.innerHTML = "<p> No Euler Circuit! </p>"
    } else if (textArea.value.length == 0) {
        result_box.innerHTML = "<p> Insufficient data </p>"

    } else {
        while (simpleClosedPath_C.length * 2 < data.length) {
            v = randomVertex(edgesArray_G_C) //Choose a v from G/ n from G/C ...
            simpleClosedPath = findClosedPath(v, edgesArray_G_C) //construct a simple closed path C in G with v as a vertex
            edgesArray_G_C = substractClosedPath(simpleClosedPath, edgesArray_G_C) //  G/C
            simpleClosedPath_C = pushCircuit(simpleClosedPath_C, simpleClosedPath) //  Add the new closed path to old (or W to C, etc)

        }

        result_box.innerHTML = "<p> Euler Circuit: " + simpleClosedPath_C + "</p>"

    }

}



//textArea.value = "1, 2, 2, 3, 3, 4, 4, 5, 5, 1, 4, 1, 1, 3, 2, 4, 5, 2, 5, 3"



bt_submit.addEventListener("click", function() {
    let edges = takeEdgesAndVertexes(textArea.value)["edges"],
        vertex = takeEdgesAndVertexes(textArea.value)["vertex"]

    eulerCircuitComputing(vertex, edges)
})