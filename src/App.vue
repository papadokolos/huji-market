<script setup>
import { ref, computed } from 'vue'
import BarChart from './components/BarChart.vue'
import LineChart from './components/LineChart.vue'
import Papa from 'papaparse'
import { DateTime } from 'luxon'
import { groupBy, removeDuplicates, filterOldPrices } from './assets/utils'


const availablePrices = ref([])

const parsedPrices = computed(() => {
  let parsedPrices = removeDuplicates(availablePrices.value)

  // Remove NIS symbol so price will only contains digits
  parsedPrices = availablePrices.value.map((price) => {
        price['מחיר'] = price['מחיר'].slice(1)
        return price
    })

  parsedPrices.sort((a, b) => a['מוצר'].localeCompare(b['מוצר']))
  parsedPrices.sort((a, b) => a['קטגוריה'].localeCompare(b['קטגוריה']))
  parsedPrices.sort((a, b) => a['מקום'].localeCompare(b['מקום']))

  parsedPrices.forEach((price) => {
    const dateParts = price['תאריך'].split("/");

    // month is 0-based, that's why we need dataParts[1] - 1
    const date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    const dateTime = DateTime.fromJSDate(date)

    price['תאריך'] = date
  })

  return parsedPrices
})

const onlyNewPrices = computed(() => filterOldPrices(parsedPrices.value))

const newestPricesByLocation = computed(() => {
  return groupBy(onlyNewPrices.value, 'מקום')
})

const checkedProducts = ref([])

const checkedProductsByProduct = computed(() => {
  return groupBy(checkedProducts.value, 'מוצר')
})

// availablePrices.value = [
//     {
//         "מחיר": "₪10.00",
//         "קטגוריה": "שתייה",
//         "מקום": "שפרינצק",
//         "מוצר": "קפה",
//         "תאריך": "04/06/2023"
//     },
//     {
//         "מחיר": "₪6.00",
//         "קטגוריה": "שתייה",
//         "מקום": "שפרינצק",
//         "מוצר": "תה",
//         "תאריך": "04/06/2023"
//     },
//     {
//         "מחיר": "₪22.00",
//         "קטגוריה": "מאפים",
//         "מקום": "שפרינצק",
//         "מוצר": "סנדוויץ'",
//         "תאריך": "04/06/2023"
//     },
//     {
//         "מחיר": "₪13.00",
//         "קטגוריה": "מאפים",
//         "מקום": "שפרינצק",
//         "מוצר": "קוראסון",
//         "תאריך": "04/06/2023"
//     },
//     {
//         "מחיר": "₪25.00",
//         "קטגוריה": "מאפים",
//         "מקום": "שפרינצק",
//         "מוצר": "פיצה",
//         "תאריך": "04/06/2023"
//     },
//     {
//         "מחיר": "₪9.00",
//         "קטגוריה": "שתייה",
//         "מקום": "פביאנו",
//         "מוצר": "קפה",
//         "תאריך": "05/06/2023"
//     },
//     {
//         "מחיר": "₪5.00",
//         "קטגוריה": "שתייה",
//         "מקום": "פביאנו",
//         "מוצר": "תה",
//         "תאריך": "05/06/2023"
//     },
//     {
//         "מחיר": "₪25.00",
//         "קטגוריה": "מאפים",
//         "מקום": "פביאנו",
//         "מוצר": "סנדוויץ'",
//         "תאריך": "05/06/2023"
//     },{
//         "מחיר": "₪25.00",
//         "קטגוריה": "מאפים",
//         "מקום": "שפרינצק",
//         "מוצר": "סנדוויץ'",
//         "תאריך": "01/07/2023"
//     },
//     {
//         "מחיר": "₪10.00",
//         "קטגוריה": "מאפים",
//         "מקום": "פביאנו",
//         "מוצר": "קוראסון",
//         "תאריך": "05/06/2023"
//     },
//     {
//         "מחיר": "₪25.00",
//         "קטגוריה": "מאפים",
//         "מקום": "פביאנו",
//         "מוצר": "פיצה",
//         "תאריך": "05/06/2023"
//     },
//     {
//         "מחיר": "₪15.00",
//         "קטגוריה": "מאפים",
//         "מקום": "פביאנו",
//         "מוצר": "סלט",
//         "תאריך": "01/06/2023"
//     },
//     {
//         "מחיר": "₪15.00",
//         "קטגוריה": "מאפים",
//         "מקום": "פביאנו",
//         "מוצר": "סלט",
//         "תאריך": "01/07/2023"
//     },
//     {
//         "מחיר": "₪17.00",
//         "קטגוריה": "מאפים",
//         "מקום": "פביאנו",
//         "מוצר": "סלט",
//         "תאריך": "01/08/2023"
//     },
//     {
//         "מחיר": "₪10.00",
//         "קטגוריה": "מאפים",
//         "מקום": "פביאנו",
//         "מוצר": "סלט",
//         "תאריך": "15/07/2023"
//     },
//     {
//         "מחיר": "₪10.00",
//         "קטגוריה": "מאפים",
//         "מקום": "שפרינצק",
//         "מוצר": "סלט",
//         "תאריך": "01/07/2023"
//     },
//     {
//         "מחיר": "₪11.00",
//         "קטגוריה": "מאפים",
//         "מקום": "שפרינצק",
//         "מוצר": "סלט",
//         "תאריך": "01/01/2023"
//     }
// ]

const fileURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZTY6XCi09QLEyikc8n4wWaunF-jj8eGCDkR-s7Bc8tm9ZzswI-vKV0CfUPJnbRzhUtxc_EJu1d89W/pub?output=csv"
const fileURLHumanFriendly = fileURL.slice(0, -11)
Papa.parse(fileURL, {
    download: true,
    header: true,
    complete: function (results) {
      availablePrices.value = results.data
    }
});
</script>

<template>
  <header>
    <div class="title">
      <h1>HUJI Market</h1>
      <h4>צרכנות נבונה בקמפוס</h4>
      <hr/>
    </div>
  </header>

  <main>
    <div class="price-compare-container">
      <div class="selection-container">
        <h2>בחרו מוצרים להשוואה:</h2>
        <div v-for="(prices, location, index) in newestPricesByLocation" :key="index">
          <h3>{{ location }}</h3>
          <div v-for="(price, nestedIndex) in prices" :key="nestedIndex">
            <input type="checkbox" :id="100 * (index+1) + (nestedIndex+1)" :value="price" v-model="checkedProducts">
            <label :for="100 * (index+1) + (nestedIndex+1)">{{price['מוצר']}}</label>
          </div>
        </div>
      </div>
      <div class="bar-chart-container">
        <BarChart :prices="checkedProducts"/>
      </div>
      <div class="line-chart-container">
        <div v-for="(prices, product, index) in checkedProductsByProduct">
          <br/>
          <h4>היסטוריית מחירים עבור: {{ product }}</h4>
          <LineChart :available-prices="availablePrices" :selected-prices="prices" />
        </div>
        <br/>
      </div>
    </div>
  </main>

  <footer>
    <hr/>
    <div>
      האתר נבנה באמצעות Vue.js.
      המחירים מעודכנים לפי קובץ
      <a :href="fileURLHumanFriendly">המחירון</a>.
      <br/>
      * מחירי השתייה לפי כוס חד-פעמית - תתכן הנחה למי שמביא כוס רב-פעמית.
    </div>
  </footer>
</template>

<style scoped>

footer {
  margin-top: auto;
  display: box;
  direction: rtl;
  font-size: smaller;
  font-family: Tahoma, Verdana, Arial, Helvetica, sans-serif;
}
.title {
  direction: rtl;
  font-family: Tahoma, Verdana, Arial, Helvetica, sans-serif;
  text-align: center;
}

.title h1 {
  margin-bottom: 0;
}

.title h4 {
  margin-top: 0;
}

.price-compare-container{
  display: flex;
  flex-direction: column;
  /* flex-wrap: wrap; */
  justify-content: center;
  direction: rtl;
  font-family: Tahoma, Verdana, Arial, Helvetica, sans-serif;
}

.selection-container {
  direction: rtl;
  margin-bottom: 5vh;
}

.bar-chart-container {
  position: relative;
  margin-left: 1vh;
  margin-right: 4vh;
}

.line-chart-container {
  position: relative;
  margin-left: 1vh;
  margin-right: 3vh;
  /* height: 60vh;
  width: 50vw; */
}

/* @media (max-width: 1024px) or (max-height: 400px) {
  .price-compare-container {
    flex-direction: column;
  }

  .bar-chart-container {
    height: 30vh;
    position: relative;
  }

  .line-chart-container {
    height: 30vh;
    width: 80vw;
  }
} */
</style>
