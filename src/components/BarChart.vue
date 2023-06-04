<template>
    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script>
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import Papa from 'papaparse'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const parsedCSV = ref([
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
    }
])

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
            return {
                labels: parsedCSV.value.map(item => item['מקום']),
                datasets: [ { data: parsedCSV.value.map(item => item['מחיר'].slice(1)) }]
            } },
        chartOptions() { return { responsive: true} }
    }
}
</script>