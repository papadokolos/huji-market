<script setup>
import { ref } from 'vue'
import BarChart from './components/BarChart.vue'
import Papa from 'papaparse'


const checkedNames = ref(['Jack'])
const prices = ref([])
prices.value = [
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

// const fileURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZTY6XCi09QLEyikc8n4wWaunF-jj8eGCDkR-s7Bc8tm9ZzswI-vKV0CfUPJnbRzhUtxc_EJu1d89W/pub?output=csv"
// Papa.parse(fileURL, {
//     download: true,
//     header: true,
//     complete: function (results) {
//         prices.value = results.data
//     }
// });
</script>

<template>
  <header>
    
  </header>

  <main>
    <div class="price-compare-container">
      <div class="selection-container">
        <div v-for="(price, index) in prices" :key="index">
          <input type="checkbox" :id="index" :value="price" v-model="checkedNames">
          <label :for="index">{{price['מוצר']}}</label>
        </div>
      </div>
      <div class="chart-container">
        <BarChart :prices="prices"/>
      </div>
    </div>
  </main>
</template>

<style scoped>
.price-compare-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  direction: rtl;
}

@media (max-width: 1024px) {
  .price-compare-container {
    flex-direction: column;
  }

}
.selection-container {
  direction: rtl;
}
.chart-container {
  position: relative;
  margin: auto;
  height: 80vh;
  width: 80vw;
}
</style>
