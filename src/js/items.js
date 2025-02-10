

const getItems = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/items');
        const data = await response.json();
        console.log(response);
        console.log('Haetaan itemeitä ja mitä ikinä');
        console.log(data);
        data.forEach(element => {
            console.log(element);
            console.log(element.name);
        });
    } catch (error) {
        console.error('Virhe:', error);
    }
}
export{getItems};
