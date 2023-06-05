<template>
    <Bar id="my-chart-id" :data="chartData" :options="chartOptions" />
</template>

<script>
import { ref, watch, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import Papa from 'papaparse'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const parsedCSV = ref([])

const pricesByProduct = ref(null)
const pricesDatasets = ref([])

function groupBy(objs, key) {
    return objs.reduce(function (r, a) {
        r[a[key]] = r[a[key]] || []
        r[a[key]].push(a)
        return r
    }, Object.create(null))
}

function removeDuplicates(objs, keys = null) {
    if (!objs) {
        return null
    }

    if (keys) {
        return objs.filter((v,i,a)=>a.findIndex(v2=>keys.every(k=>v2[k] ===v[k]))===i)
    }
    else {
        return objs.filter((v,i,a)=>a.findIndex(v2=>(JSON.stringify(v2) === JSON.stringify(v)))===i)
    }
}

function filterOldPrices(prices) {
    let filteredPrices = []

    let pricesByLocation = groupBy(prices, 'מקום')
    Object.entries(pricesByLocation).forEach(([location, locationPrices]) => {
        let productPrices = groupBy(locationPrices, 'מוצר')
        Object.entries(productPrices).forEach(([product, productPrices]) => {
            if (productPrices) {
                let newestPrice = takeNewestPrice(productPrices)
                filteredPrices.push(newestPrice)
            }
        })
    })

    return filteredPrices
}

function takeNewestPrice(pricesByLocation) {
    let newestDate = new Date(pricesByLocation[0]['תאריך'])
    let newestPriceObject = pricesByLocation[0]

    pricesByLocation.forEach((priceObject) => {
        let date = new Date(priceObject['תאריך'])
        if (date > newestDate) {
            newestDate = date
            newestPriceObject = priceObject
        }
    })

    return newestPriceObject
}

watch(parsedCSV, (newCSV, oldCSV) => {
    let prices = removeDuplicates(newCSV)
    prices = filterOldPrices(prices)
    prices = prices.map((price) => {
        price['מחיר'] = price['מחיר'].slice(1)
        return price
    })
    pricesByProduct.value = groupBy(prices, 'מוצר')
})

watch(pricesByProduct, (newPrices, oldPrices) => {
    let chartDatasets = []

    if (newPrices) {
        Object.entries(newPrices).forEach(([product, productPrices]) => {
            let dataset = {
                label: product,
                data: productPrices,
                backgroundColor: dynamicColors()
            }

            chartDatasets.push(dataset)
        })
    }

    console.log(chartDatasets)
    pricesDatasets.value = chartDatasets
})

parsedCSV.value = [
    {
        "מחיר": "₪10.00",
        "קטגוריה": "שתייה",
        "מקום": "שפרינצק",
        "מוצר": "קפה",
        "תאריך": "04/06/2023"
    },
    {
        "מחיר": "₪6.00",
        "קטגוריה": "שתייה",
        "מקום": "שפרינצק",
        "מוצר": "תה",
        "תאריך": "04/06/2023"
    },
    {
        "מחיר": "₪22.00",
        "קטגוריה": "מאפים",
        "מקום": "שפרינצק",
        "מוצר": "סנדוויץ'",
        "תאריך": "04/06/2023"
    },
    {
        "מחיר": "₪13.00",
        "קטגוריה": "מאפים",
        "מקום": "שפרינצק",
        "מוצר": "קוראסון",
        "תאריך": "04/06/2023"
    },
    {
        "מחיר": "₪25.00",
        "קטגוריה": "מאפים",
        "מקום": "שפרינצק",
        "מוצר": "פיצה",
        "תאריך": "04/06/2023"
    },
    {
        "מחיר": "₪9.00",
        "קטגוריה": "שתייה",
        "מקום": "פביאנו",
        "מוצר": "קפה",
        "תאריך": "05/06/2023"
    },
    {
        "מחיר": "₪5.00",
        "קטגוריה": "שתייה",
        "מקום": "פביאנו",
        "מוצר": "תה",
        "תאריך": "05/06/2023"
    },
    {
        "מחיר": "₪25.00",
        "קטגוריה": "מאפים",
        "מקום": "פביאנו",
        "מוצר": "סנדוויץ'",
        "תאריך": "05/06/2023"
    },
    {
        "מחיר": "₪10.00",
        "קטגוריה": "מאפים",
        "מקום": "פביאנו",
        "מוצר": "קוראסון",
        "תאריך": "05/06/2023"
    },
    {
        "מחיר": "₪25.00",
        "קטגוריה": "מאפים",
        "מקום": "פביאנו",
        "מוצר": "פיצה",
        "תאריך": "05/06/2023"
    },
    {
        "מחיר": "₪15.00",
        "קטגוריה": "מאפים",
        "מקום": "פביאנו",
        "מוצר": "סלט",
        "תאריך": "01/06/2023"
    }
]

function dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
}

function formatNumberToNIS(price) {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(price)
}

// const parsedCSV = ref(null)

// const fileURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZTY6XCi09QLEyikc8n4wWaunF-jj8eGCDkR-s7Bc8tm9ZzswI-vKV0CfUPJnbRzhUtxc_EJu1d89W/pub?output=csv"
// Papa.parse(fileURL, {
//     download: true,
//     header: true,
//     complete: function (results) {
//         console.log("Finished:", results.data);
//         parsedCSV.value = results.data
//     }
// });

export default {
    name: 'BarChart',
    components: { Bar },
    computed: {
        chartData() { 
            return { datasets: pricesDatasets.value }
        },
        chartOptions() { return {
            responsive: true,
            parsing: {
                xAxisKey: 'מקום',
                yAxisKey: 'מחיר'
            },
            plugins: {
                legend: {
                    rtl: true,
                    textDirection: 'rtl'
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || ''

                            if (label) {
                                label += ': '
                            }
                            if (context.parsed.y !== null) {
                                label += formatNumberToNIS(context.parsed.y)
                            }
                            return label
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    ticks: {
                        callback: (value, index, ticks) => {
                            return formatNumberToNIS(value)
                        }
                    },
                    stacked: true
                }
            }
        }}
    }
}
</script>