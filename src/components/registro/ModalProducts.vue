<template>
    <div class="fade">
        <div class="modalFrame card">
            <div class="closeButton">
                <i 
                class="material-icons modalClose" 
                @click="$emit('close-modal')">close</i>
            </div>
            <form action="#" method="post" @submit.prevent="sendProduct">

                <div class="input-field">
                    <i class="material-icons prefix">shopping_basket</i>
                    <input
                    ref="firstInput"
                    placeholder="Nombre del producto" 
                    type="text" 
                    class="validate"
                    v-model="name">
                </div>

                <div class="precio_stock">
                    
                    <div class="input-field stockDiv">
                        <i class="material-icons prefix">inbox</i>
                        <input 
                        placeholder="Existencia" 
                        type="number" 
                        class="validate"
                        v-model="stock">
                    </div>
                    
                    <div class="input-field">
                        <i class="material-icons prefix">account_balance_wallet</i>
                        <input 
                        placeholder="Precio" 
                        type="text"
                        v-model="price" 
                        class="validate"
                        >
                    </div>

                </div>
                
                <div class="selectInput">
                    <i class="material-icons prefix">label</i>
                    <select name="select" v-model="category_id">
                        <option value="si" selected>Categoria</option>
                        <option 
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id">{{ category.name }}</option>
                    </select>
                </div>
                
                <div class="input-field presentacion">
                    <i class="material-icons prefix">style</i>
                    <input 
                    placeholder="Presentación" 
                    type="text" 
                    class="validate"
                    v-model="price_type">
                </div>

                <input class="btn sendButton" type="submit" value="Guardar">
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, watch} from 'vue';

const URL = 'http://localhost:3000/api/inventory'
export default{
    emits: ['closeAndReload'],
    setup(_, { emit }){

        const categories = ref({})
        const showModal = ref(false)
        const firstInput = ref(null)

        //Datos
        const name = ref("")
        const stock = ref(0)
        const category_id = ref("si")
        const price = ref("00.00")
        const price_type = ref("")

        watch(price, (nuevoValor) => {
        })

        const sendProduct = () => {
            const data = {
                name: name.value,
                stock: stock.value,
                category_id: category_id.value,
                price: price.value,
                price_type: price_type.value
            }

            console.log(data)

            axios.post(`${URL}/products`, data,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(res => {
                console.log(res)
                if(res.status === 201){
                    showModal.value = false
                    emit("closeAndReload")
                }
            })
        }

        onMounted(() => {
            axios.get(`${URL}/categories`).then(res => {
                console.log(res)
                categories.value = res.data
                firstInput.value?.focus()
            })
        })
        return{
            categories,
            price,
            name,
            stock,
            category_id,
            price_type,
            sendProduct,
            firstInput
        }
    }
}
</script>

<style scoped>
.fade{
    position: fixed;
    background-color: rgba(0, 0, 0, 0.541);
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vw;
    display: flex;
    justify-content: center;
    padding-top: 3em;
}

.modalFrame {
    background-color: rgb(253, 253, 253);
    max-width: 440px;
    border-radius: 10px;
    padding: 2em 1em 2em 1em;
    height: 500px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
}

.closeButton{
    width: 90%;
    display: flex;
    flex-direction: row-reverse;
}

.selectInput{
    display: flex;
    align-items: center;
    margin-bottom: 1em;
}

.selectInput i {
    margin-right: 10px;
}

.selectInput select{
    border-bottom: 1px solid #2135478a;
    cursor: pointer;
}

.precio_stock{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 1em;
    margin-bottom: 1em;
}

.stockDiv{
    margin-right: 2em;
}

form{
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.presentacion{
    margin-top: 1em;
    margin-bottom: 1em;
}

.sendButton{
    background-color: #213547;
}

.modalClose{
    cursor: pointer;
}
</style>