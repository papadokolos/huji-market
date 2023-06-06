<script setup>
import { ref, watch, computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { groupBy, removeDuplicates, filterOldPrices } from '../assets/utils'
import 'luxon';
import 'chartjs-adapter-luxon';


ChartJS.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
    selectedPrices: {
        required: true
    },
    availablePrices: {
        required: true
    }
})

const pricesByProduct = ref(null)
const pricesDatasets = ref([])

const chartData = computed(() => {
    return {
        datasets: pricesDatasets.value
    }
})

const chartOptions = computed(() => {
    return {
        responsive: true,
        parsing: {
            xAxisKey: 'תאריך',
            yAxisKey: 'מחיר'
        },
        elements: {
            point: {
                radius: 10,
                hoverRadius: 15,
                hitRadius: 10
            }
        },
        plugins: {
            legend: {
                rtl: true,
                textDirection: 'rtl'
            },
            tooltip: {
                rtl: false,
                textDirection: 'ltr'
            }
        },
        scales: {
            x: {
                display: 'auto',
                type: 'time',
                time: {
                    // unit: 'month',
                    tooltipFormat: 'dd LLL yyyy'
                },
                ticks:{
                    // source: 'data',
                    autoSkip: true,
                    maxTicksLimit: 5
                },
            },
            y: {
                ticks: {
                    callback: (value, index, ticks) => {
                        return formatNumberToNIS(value)
                    },
                    stepSize: 5
                },
                min: 0,
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

function formatNumberToNIS(price) {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(price)
}

watch([() => props.selectedPrices, pricesByProduct], ([newSelectedPrices, newPricesByProduct]) => {
    if (!newPricesByProduct) {
        return
    }

    colorIndex = 0

    let chartDatasets = []
    const selectedPricesByProduct = groupBy(newSelectedPrices, ['מוצר'])
    
    Object.entries(selectedPricesByProduct).forEach(([product, selectedPrices]) => {
        const productPrices = newPricesByProduct[product]
        
        selectedPrices.forEach((selectedPrice) => {
            let productPricesInLocation = productPrices.filter(
                price => price['מקום'] == selectedPrice['מקום'])
            
            productPricesInLocation.sort((a, b) => {
                return a['תאריך'] - b['תאריך']
            })
                
                let dataset = {
                    label: selectedPrice['מקום'],
                    data: productPricesInLocation,
                    backgroundColor: getNextColor(),
            }
            
            chartDatasets.push(dataset)
        })
    })

    pricesDatasets.value = chartDatasets
})

watch(() => props.availablePrices, (newAvailablePrices) => {
    pricesByProduct.value = groupBy(newAvailablePrices, 'מוצר')
}, { immediate: true })
</script>

<template>
    <Line :data="chartData" :options="chartOptions" />
</template>

<style scoped>
</style>