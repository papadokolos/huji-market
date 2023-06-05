<script setup>
import { ref, watch, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { groupBy, removeDuplicates, filterOldPrices } from '../assets/utils'


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
    prices: {
        required: true
    }
})

const newestPrices = ref(null)
const pricesByProduct = ref(null)
const pricesDatasets = ref([])

const chartData = computed(() => {
    return { datasets: pricesDatasets.value }
})

const chartOptions = computed(() => {
    return {
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
                    footer: getPriceSumForlocation,
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
                    },
                    stepSize: 5
                },
                stacked: true,
                afterDataLimits: function(axis) {
                    axis.max += 1; // add 1px to top
                }
            }
        }
    }
})

const arrayOfColors = [
    'rgb(184, 59, 94, 0.6)',
    'rgb(106, 44, 112, 0.6)',
    'rgb(240, 138, 93, 0.6)',
    'rgb(249, 237, 105, 0.6)',
    'rgb(59, 117, 184, 0.6)',
    'rgb(59, 184, 128, 0.6)'
]
let colorIndex = 0

function getNextColor() {
    let color = arrayOfColors[colorIndex]
    colorIndex = (colorIndex + 1) % arrayOfColors.length

    return color
}

function getPriceSumForlocation(tooltipItems) {
    let sum = 0;

    if (tooltipItems.length == 1) {
        const location = tooltipItems[0]['label']
        let chart = tooltipItems[0].chart

        chart.getDatasetMeta(0)
        chart.data.datasets.forEach((dataset, datasetIndex) => {
            const isDatasetHidden = chart.getDatasetMeta(datasetIndex).hidden

            if (!isDatasetHidden) {
                dataset.data.forEach((data) => {
                    if (data['מקום'] == location) {
                        sum += Number(data['מחיר'])
                    }
                })
            }
        })
    }
    else {
    tooltipItems.forEach((tooltipItem) => {
        sum += tooltipItem.parsed.y;
    })}

    return 'סה"כ: ' + formatNumberToNIS(sum);
}

function dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
}

function formatNumberToNIS(price) {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(price)
}

watch(pricesByProduct, (newPrices, oldPrices) => {
    let chartDatasets = []

    if (newPrices) {
        Object.entries(newPrices).forEach(([product, productPrices]) => {
            let dataset = {
                label: product,
                data: productPrices,
                backgroundColor: getNextColor(),
                barPercentage: 0.25
            }

            chartDatasets.push(dataset)
        })
    }

    pricesDatasets.value = chartDatasets
})

watch(newestPrices, (newPrices, oldPrices) => {
    pricesByProduct.value = groupBy(newPrices, 'מוצר')
})

watch(() => props.prices, (newPrices, oldPrices) => {
    colorIndex = 0
    let filteredPrices = removeDuplicates(newPrices)
    filteredPrices = filterOldPrices(filteredPrices)
    newestPrices.value = filteredPrices
}, { immediate: true })
</script>

<template>
    <Bar id="my-chart-id" :data="chartData" :options="chartOptions" />
</template>

<style scoped>
</style>