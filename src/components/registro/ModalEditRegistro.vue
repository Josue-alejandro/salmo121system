<template>
    <div class="fade">
        <div class="modalFrame card">
            <div class="closeButton">
                <i 
                class="material-icons modalClose" 
                @click="$emit('close-modal')">close</i>
            </div>
            <form action="#" method="post" @submit.prevent="updateSupply">

                <!-- Producto -->
                <div class="selectInput">
                    <i class="material-icons prefix">shopping_basket</i>
                    <select v-model="product_id">
                        <option value="" disabled>Selecciona un producto</option>
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
                        <option value="" disabled>Selecciona un proveedor</option>
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

                <input class="btn sendButton" type="submit" value="Actualizar">
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';

const BASE_URL = 'http://192.168.1.200:3000/api/supply/register';

export default {
    props: {
        supply: Object  // Recibe el registro a editar
    },
    emits: ['closeAndReload'],
    setup(props, { emit }) {
        const products = ref([]);
        const providers = ref([]);

        // Datos del formulario (se llenarán con la `supply` recibida)
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

        // Rellenar los campos con los datos actuales de `supply`
        watch(() => props.supply, (newSupply) => {
            if (newSupply) {
                product_id.value = newSupply.product_id;
                quantity.value = newSupply.quantity;
                type_of_quantity.value = newSupply.type_of_quantity;
                type.value = newSupply.type;
                weight.value = newSupply.weight;
                provider.value = newSupply.provider;
                date.value = newSupply.date;
                payed.value = newSupply.payed;
                owed.value = newSupply.owed;
                price.value = newSupply.price;
            }
        }, { immediate: true });

        // Enviar actualización
        const updateSupply = () => {
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

            console.log("Actualizando datos:", data);

            axios.put(`${BASE_URL}/${props.supply.id}`, data, {
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    emit("closeAndReload");
                }
            })
            .catch(error => console.error("Error al actualizar:", error));
        };

        // Cargar productos y proveedores
        onMounted(() => {
            axios.get('http://192.168.1.200:3000/api/inventory/products?all=true')
                .then(res => products.value = res.data.products)
                .catch(error => console.error("Error cargando productos:", error));

            axios.get('http://192.168.1.200:3000/api/provider/get')
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
            updateSupply
        };
    }
}
</script>

<style scoped>
.fade {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.541);
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh; /* Corregido para ocupar toda la pantalla */
    display: flex;
    justify-content: center;
    align-items: center; /* Centrar modal */
    padding: 1em;
}

.modalFrame {
    background-color: rgb(253, 253, 253);
    max-width: 90%; /* En lugar de un tamaño fijo */
    width: 400px; /* Valor base */
    border-radius: 10px;
    padding: 1.5em;
    max-height: 90vh; /* Para evitar que sobresalga en pantallas pequeñas */
    overflow-y: auto; /* Hacer scroll si es necesario */
    display: flex;
    flex-direction: column;
}

.closeButton {
    display: flex;
    justify-content: flex-end;
}

.selectInput,
.input-field {
    display: flex;
    align-items: center;
    margin-bottom: 1em;
}

.selectInput i,
.input-field i {
    margin-right: 10px;
}

.precio_stock {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1em;
}

form {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.sendButton {
    background-color: #213547;
}

/* Estilos para pantallas pequeñas */
@media screen and (max-width: 480px) {
    .modalFrame {
        width: 100%; /* Aprovecha todo el espacio */
        max-height: 95vh; /* Máximo 95% de la altura */
        padding: 4em 1em 4em 1em;
    }

    .precio_stock {
        flex-direction: column; /* Apilar elementos verticalmente */
        gap: 0.5em;
    }

    .selectInput,
    .input-field {
        flex-direction: column; /* Inputs apilados */
        align-items: flex-start;
    }

    .selectInput i,
    .input-field i {
        margin-bottom: 5px;
    }
}
</style>
