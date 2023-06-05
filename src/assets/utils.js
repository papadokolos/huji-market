export function groupBy(objs, key) {
    return objs.reduce((r, a) => {
        r[a[key]] = r[a[key]] || []
        r[a[key]].push(a)
        return r
    }, Object.create(null))
}

export function removeDuplicates(objs, keys = null) {
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

export function filterOldPrices(prices) {
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