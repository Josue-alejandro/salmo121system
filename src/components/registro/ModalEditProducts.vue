<template>
    <div class="fade">
        <div class="modalFrame card">
            <div class="closeButton">
                <i 
                class="material-icons modalClose" 
                @click="$emit('close-modal')">close</i>
            </div>
            <form action="#" method="post" @submit.prevent="updateProduct">

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
                        class="validate">
                    </div>
                </div>
                
                <div class="selectInput">
                    <i class="material-icons prefix">label</i>
                    <select name="select" v-model="category_id">
                        <option value="" disabled>Seleccione una categoría</option>
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

                <div class="modal-actions">
                    <input class="btn sendButton" type="submit" value="Guardar">
                    <button type="button" class="btn cancelButton" @click="$emit('close-modal')">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';

const URL = 'http://192.168.1.200:3000/api/inventory';
export default {
    props: {
        product: Object // Recibe el producto a editar
    },
    emits: ['closeAndReload'],
    setup(props, { emit }) {
        const categories = ref([]);
        const firstInput = ref(null);

        // Datos inicializados con el producto recibido
        const name = ref(props.product?.name || "");
        const stock = ref(props.product?.stock || 0);
        const category_id = ref(props.product?.category || "1");
        const price = ref(props.product?.price || "00.00");
        const price_type = ref(props.product?.price_type || "");

        const updateProduct = () => {
            const data = {
                name: name.value,
                stock: stock.value,
                category_id: category_id.value,
                price: price.value,
                price_type: price_type.value
            };

            console.log("Actualizando producto", data);

            axios.put(`${URL}/products/${props.product.id}`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                console.log(res);
                if (res.status === 200) {
                    emit("closeAndReload");
                }
            });
        };

        onMounted(() => {
            axios.get(`${URL}/categories`).then(res => {
                console.log(res);
                categories.value = res.data;
                firstInput.value?.focus();
            });
        });

        return {
            categories,
            price,
            name,
            stock,
            category_id,
            price_type,
            updateProduct,
            firstInput
        };
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