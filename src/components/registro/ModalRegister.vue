<template>
    <div class="fade">
        <div class="modalFrame card">
            <div class="closeButton">
                <i 
                class="material-icons modalClose" 
                @click="$emit('close-modal')">close</i>
            </div>
            <form action="#" method="post" @submit.prevent="sendSupply">

                <!-- Producto -->
                <div class="selectInput">
                    <i class="material-icons prefix">shopping_basket</i>
                    <select v-model="product_id">
                        <option value="" disabled selected>Selecciona un producto</option>
                        <option 
                        v-for="product in products"
                        :key="product.id"
                        :value="product.id">{{ product.name }}</option>
                    </select>
                </div>

                <!-- Cantidad y Tipo de cantidad -->
                <div class="precio_stock">
                    
                    <div class="input-field stockDiv">
                        <i class="material-icons prefix">inbox</i>
                        <input 
                        placeholder="Cantidad" 
                        type="number" 
                        class="validate"
                        v-model="quantity">
                    </div>
                    
                    <div class="input-field">
                        <i class="material-icons prefix">style</i>
                        <input 
                        placeholder="Tipo de cantidad (Ej: kg, saco)" 
                        type="text"
                        v-model="type_of_quantity" 
                        class="validate"
                        >
                    </div>

                </div>
                
                <!-- Tipo y Peso -->
                <div class="precio_stock">
                    
                    <div class="input-field">
                        <i class="material-icons prefix">label</i>
                        <input 
                        placeholder="Tipo (Ej: A, B, C)" 
                        type="text" 
                        class="validate"
                        v-model="type">
                    </div>
                    
                    <div class="input-field">
                        <i class="material-icons prefix">fitness_center</i>
                        <input 
                        placeholder="Peso (kg)" 
                        type="text"
                        v-model="weight" 
                        class="validate"
                        >
                    </div>

                </div>

                <!-- Proveedor -->
                <div class="selectInput">
                    <i class="material-icons prefix">account_circle</i>
                    <select v-model="provider">
                        <option value="" disabled selected>Selecciona un proveedor</option>
                        <option 
                        v-for="prov in providers"
                        :key="prov.id"
                        :value="prov.id">{{ prov.name }}</option>
                    </select>
                </div>

                <!-- Fecha -->
                <div class="input-field">
                    <i class="material-icons prefix">event</i>
                    <input 
                    type="date" 
                    v-model="date"
                    class="validate">
                </div>

                <!-- Cancelado y Pendiente -->
                <div class="precio_stock">
                    
                    <div class="input-field">
                        <i class="material-icons prefix">account_balance_wallet</i>
                        <input 
                        placeholder="Monto cancelado" 
                        type="text"
                        v-model="payed" 
                        class="validate"
                        >
                    </div>

                    <div class="input-field">
                        <i class="material-icons prefix">money_off</i>
                        <input 
                        placeholder="Monto pendiente" 
                        type="text"
                        v-model="owed" 
                        class="validate"
                        >
                    </div>

                </div>

                <!-- Precio -->
                <div class="input-field">
                    <i class="material-icons prefix">attach_money</i>
                    <input 
                    placeholder="Precio" 
                    type="text"
                    v-model="price"
                    class="validate">
                </div>

                <input class="btn sendButton" type="submit" value="Guardar">
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

const URL = 'http://localhost:3000/api/inventory/supply';

export default {
    emits: ['closeAndReload'],
    setup(_, { emit }) {
        const products = ref([]);
        const providers = ref([]);
        
        // Datos del formulario
        const product_id = ref("");
        const quantity = ref(0);
        const type_of_quantity = ref("");
        const type = ref("");
        const weight = ref("");
        const provider = ref("");
        const date = ref("");
        const payed = ref("0.00");
        const owed = ref("0.00");
        const price = ref("0.00");

        const sendSupply = () => {
            const data = {
                product_id: product_id.value,
                quantity: quantity.value,
                type_of_quantity: type_of_quantity.value,
                type: type.value,
                weight: weight.value,
                provider: provider.value,
                date: date.value,
                payed: payed.value,
                owed: owed.value,
                price: price.value
            };

            console.log("Enviando datos:", data);

            axios.post(URL, data, {
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => {
                console.log(res);
                if (res.status === 201) {
                    emit("closeAndReload");
                }
            })
            .catch(error => console.error("Error al enviar:", error));
        };

        onMounted(() => {
            axios.get('http://localhost:3000/api/inventory/products?all=true')
                .then(res => {
                    console.log(res)
                    products.value = res.data.products}
                )
                .catch(error => console.error("Error cargando productos:", error));

            axios.get('http://localhost:3000/api/inventory/providers')
                .then(res => providers.value = res.data.providers)
                .catch(error => console.error("Error cargando proveedores:", error));
        });

        return {
            products,
            providers,
            product_id,
            quantity,
            type_of_quantity,
            type,
            weight,
            provider,
            date,
            payed,
            owed,
            price,
            sendSupply
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
    height: 800px;
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