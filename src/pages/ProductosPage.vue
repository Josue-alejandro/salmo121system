<template>
    <div class="titleDiv">
        <h5>Productos</h5>
    </div>
    <div class="tableDiv">
        <div class="botones">
            <button class="btn blue darken-1" @click="modalAddHandler"><i class="material-icons">add</i></button>
            <button class="btn amber darken-3"><i class="material-icons">edit</i></button>
            <button class="btn red darken-4" @click="deleteSelected"><i class="material-icons">delete</i></button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Existencia</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Tipo</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id" 
                    :class="{ selected: selectedProducts.includes(product.id)}" 
                    @click="toggleSelection(product.id)">
                    <td>{{ product.name }}</td>
                    <td>{{ product.stock }}</td>
                    <td>{{ product.category }}</td>
                    <td>{{ product.price }} Bs</td>
                    <td>{{ product.price_type }}</td>
                </tr>
            </tbody>
        </table>
        <Transition>
            <ModalProducts 
            v-if="modalShow"
            @close-modal="modalAddHandler"
            @closeAndReload="closeAndReload"></ModalProducts>
        </Transition>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios'
import ModalProducts from '../components/registro/ModalProducts.vue';
const URL = "http://localhost:3000/api/inventory/products"

export default{
    components:{
        ModalProducts: ModalProducts
    },
    setup(){
        const products = ref([]);
        const modalShow = ref(false);
        const selectedProducts = ref([]);

        const modalAddHandler = () => {
            modalShow.value = !modalShow.value;
        };

        const toggleSelection = (id) => {
            const index = selectedProducts.value.indexOf(id);
            if (index === -1) {
                selectedProducts.value.push(id);
            } else {
                selectedProducts.value.splice(index, 1);
            }
        };

        const closeAndReload = () => {
            modalShow.value = false
            getData()
        }

        const deleteSelected = () => {
            console.log(selectedProducts.value);
            
            axios.delete(URL, {
                data: { ids: selectedProducts.value }, // <- Aquí debe ir dentro de `data`
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                console.log(res);
                getData()
            }).catch(error => {
                console.error(error);
            });
        };

        const getData = () => {
            axios.get(URL)
            .then(response => {
                products.value = response.data;
            });
        }

        onMounted(() => {
            getData()
        });

        return {
            products,
            modalShow,
            modalAddHandler,
            selectedProducts,
            toggleSelection,
            deleteSelected,
            closeAndReload
        };
    }
}
</script>

<style setup>
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
}

.botones button {
    margin: 1em 1em 1em 0em;
}

.selected {
    background-color: #d3d3d3; /* Color gris claro para indicar selección */
    cursor: pointer;
}

.item{
    cursor: pointer;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>