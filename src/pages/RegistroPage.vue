<template>
    <div class="titleDiv">
        <h5>Registro del inventario</h5>
    </div>
    <div class="tableDiv">
        <div class="botones">
            <button class="btn blue darken-1"><i class="material-icons">add</i></button>
            <button class="btn amber darken-3"><i class="material-icons">edit</i></button>
            <button class="btn red darken-4"><i class="material-icons">delete</i></button>
            <div class="input-field">
                <i class="material-icons prefix">search</i>
                <input id="icon_prefix" type="text" class="validate">
                <label for="icon_prefix">First Name</label>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Presentación</th>
                    <th>Cantidad</th>
                    <th>Tipo</th>
                    <th>Peso</th>
                    <th>Precio</th>
                    <th>Cancelado</th>
                    <th>Pendiente</th>
                    <th>Proveedor</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.index">
                    <td>{{ formattHour(product.date) }}</td>
                    <td>{{ product.product_name }}</td>
                    <td>{{ product.type_of_quantity }}</td>
                    <td>{{ product.quantity }}</td>
                    <td>{{ product.type }}</td>
                    <td>{{ product.weight }} Kg</td>
                    <td>{{ product.price }} Bs</td>
                    <td class="pagado">{{ product.payed }} Bs</td>
                    <td class="deuda">{{ product.owed }} Bs</td>
                    <td>{{ product.provider }}</td>
                </tr>
            </tbody>
        </table>
        <div>
            <ModalRegister></ModalRegister>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios'

import ModalRegister from '../components/registro/ModalRegister.vue';

const URL = "http://localhost:3000/api/inventory/supply"

export default{
    components:{
        ModalRegister: ModalRegister
    },
    setup(){

        const products = ref({})

        // Funciones
        const formattHour = (mysqlDate) =>{
                const date = new Date(mysqlDate);
                
                // Obtener partes de la fecha
                const day = date.getDate();
                const month = date.getMonth() + 1; // Los meses empiezan desde 0 en JavaScript
                const year = date.getFullYear();
                
                // Obtener la hora y minuto
                const hour = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, '0'); // Aseguramos que los minutos tengan siempre dos dígitos
                
                // Formato final: D/M/A H/M
                return `${day}/${month}/${year}`;
        }

        onMounted(() => {
            axios.get(URL)
            .then(response => {
                products.value = response.data
            })
        })

        return {
            products,
            formattHour
        }
    }
}
</script>

<style scoped>
th, td{
    padding: 0.7em 1em;
}

th{
    background-color: #213547;
    color: white;
    border-radius: 0px;
}

table{
    width: 90vw;
}

.tableDiv{
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.titleDiv{
    width: 100%;
    display: flex;
    margin: 1em;
}

.pagado{
    color: rgb(7, 99, 7);
}

.deuda{
    color: rgb(117, 15, 15);
}

.botones{
    padding: 1em;
    width: 90vw;
    display: flex;
}

.botones button {
    margin: 1em 1em 1em 0em;
}
</style>