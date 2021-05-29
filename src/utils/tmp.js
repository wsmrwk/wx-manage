let newData = []
let detailData = []
if (data && Object.keys(data).length > 0) {
    newData = data[key].data || []
    detailData = data[key].relationData || {}
}