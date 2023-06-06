<script setup>
import { ref, computed } from 'vue'
import BarChart from './components/BarChart.vue'
import Papa from 'papaparse'
import { groupBy, removeDuplicates, filterOldPrices } from './assets/utils'


const availablePrices = ref([])

const parsedPrices = computed(() => {
  let parsedPrices = availablePrices.value.map((price) => {
        price['מחיר'] = price['מחיר'].slice(1)
        return price
    })

  parsedPrices.sort((a, b) => a['מוצר'].localeCompare(b['מוצר']))
  parsedPrices.sort((a, b) => a['קטגוריה'].localeCompare(b['קטגוריה']))
  parsedPrices.sort((a, b) => a['מקום'].localeCompare(b['מקום']))

  return parsedPrices
})

const pricesByLocation = computed(() => {
  return groupBy(parsedPrices.value, 'מקום')
})

const checkedProducts = ref([])

availablePrices.value = [
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
//       availablePrices.value = results.data
//     }
// });
</script>

<template>
  <header>
    
  </header>

  <main>
    <div class="price-compare-container">
      <div class="selection-container">
        <h2>בחרו מוצרים להשוואה:</h2>
        <div v-for="(prices, location, index) in pricesByLocation" :key="index">
          <h3>{{ location }}</h3>
          <div v-for="(price, nestedIndex) in prices" :key="nestedIndex">
            <input type="checkbox" :id="100 * (index+1) + (nestedIndex+1)" :value="price" v-model="checkedProducts">
            <label :for="100 * (index+1) + (nestedIndex+1)">{{price['מוצר']}}</label>
          </div>
        </div>
      </div>
      <div class="chart-container">
        <BarChart :prices="checkedProducts"/>
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
  font-family: Tahoma, Verdana, Arial, Helvetica, sans-serif;
}

@media (max-width: 1024px) or (max-height: 400px) {
  .price-compare-container {
    flex-direction: column;
  }

}
.selection-container {
  direction: rtl;
  margin-bottom: 5vh;
}
.chart-container {
  position: relative;
  margin: auto;
  height: 80vh;
  width: 80vw;
}
</style>
