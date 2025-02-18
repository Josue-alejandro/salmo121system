<template>
    <div class="tableDiv">
        <div class="filtros">
            <h3>Filtros:</h3>
            <div class="fechas">
                <input 
                v-model="startDate"
                class="dateInput" 
                type="date">
                <input 
                v-model="endDate"
                class="dateInput" 
                type="date">
                <input placeholder="Producto"
                v-model="productFilter"
                class="dateInput"
                type="text">
            </div>
            <div>
                <button class="btn" @click="filterRegisters">Filtrar</button>
            </div>
        </div>
        <Transition>
        <div class="tableContainer" v-if="!loading">
            <DataTable 
            title="Registro" 
            :columns="[
                { key: 'product_id', label: 'Producto' },
                { key: 'quantity', label: 'Cantidad' },
                { key: 'type_of_quantity', label: 'Presentación' },
                { key: 'type', label: 'Tipo' },
                { key: 'weight', label: 'Peso (Kg)'},
                { key: 'provider', label: 'Proveedor'},
                { key: 'date', label: 'Fecha'},
                { key: 'price', label: 'Precio'},
                { key: 'payed', label: 'Cancelado'},
                { key: 'owed', label: 'Pendiente'},
                ]"
                :data="products"
                :loading="isLoading"
                :searchable="true"
                :sortable="true"
                @edit="modalEditHandler"
                @delete="deleteSelected"
                @add="modalAddHandler"
            />
            <div class="pagination">
                    <button 
                    v-for="pageNumber in pagesNumber" 
                    :key="pageNumber" 
                    @click="changePage(pageNumber)"
                    :class="{ activePagination: currentPage === pageNumber,
                    'paginacionButtons': true
                     }">
                    {{ pageNumber }}
                    </button>
            </div>
        </div>
        <div v-else>
            <div class="loading">
                <i class="material-icons loadingIcon">hourglass_empty</i>
            </div>
        </div>
        </Transition>
        <Transition>
            <ModalRegister 
            v-if="modalShow" 
            @close-modal="modalShow = false" 
            @closeAndReload="closeAndReload"
            ></ModalRegister>
        </Transition>
        <Transition>
            <ModalEditRegistro
            v-if="modalEdit"
            @close-modal="modalEditHandler"
            @closeAndReload="closeAndReload"
            :supply="toEditProduct">
            </ModalEditRegistro>
        </Transition>
    </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import ModalProducts from '../components/registro/ModalProducts.vue';
import ModalEditProducts from '../components/registro/ModalEditProducts.vue';
import DataTable from '../components/UI/DataTable.vue';
import ModalRegister from '../components/registro/ModalRegister.vue';
import ModalEditRegistro from '../components/registro/ModalEditRegistro.vue';

const URL = "http://192.168.1.200:3000/api";

export default {
    components: {
        ModalProducts,
        ModalEditProducts,
        DataTable,
        ModalRegister,
        ModalEditRegistro
    },
    setup() {
        const products = ref([]);
        const modalShow = ref(false);
        const modalEdit = ref(false);
        const selectedProducts = ref([]);
        const loading = ref(true);
        const searchQuery = ref("");
        const pagesNumber = ref(0)
        const currentPage = ref(1)
        const pageLimit = ref(12)
        const toEditProduct = ref({})
        const startDate = ref()
        const endDate = ref()
        const productFilter = ref("")
        
        const reverseArray = (arr) => {
            return arr.slice().reverse();
        }

        const modalAddHandler = () => {
            modalShow.value = !modalShow.value;
        };

        const modalEditHandler = (product) => {
            if(!product){
                toEditProduct.value = {}
                modalEdit.value = false
            }else{            
                modalEdit.value = !modalEdit.value
                toEditProduct.value = product
            }
        }

        const toggleSelection = (id) => {
            const index = selectedProducts.value.indexOf(id);
            if (index === -1) {
                selectedProducts.value.push(id);
            } else {
                selectedProducts.value.splice(index, 1);
            }
        };

        const closeAndReload = () => {
            modalShow.value = false;
            modalEdit.value = false;
            getData();
        };

        const deleteSelected = (productsSelected) => {
            axios.delete(`${URL}/supply/register`, {
                data: { ids: productsSelected },
                headers: { 'Content-Type': 'application/json' }
            }).then(() => {
                getData();
            }).catch(error => {
                console.error(error);
            });
        };

        const getData = (pages, limit) => {
            loading.value = true;
            if(!pages && !limit){
                axios.get(`${URL}/supply/register?all=true`)
                .then(response => {
                    products.value = reverseArray(response.data.supply);
                    loading.value = false;
                });
            }else{
                axios.get(`${URL}/supply/register?page=${pages}&limit=${limit}`)
                .then(response => {
                    products.value = reverseArray(response.data.supply);
                    pagesNumber.value = response.data.totalPages
                    loading.value = false;
                });
            }
        };

        const changePage = (pageNumber) => {
            if (pageNumber !== currentPage.value) {
                currentPage.value = pageNumber;
                getData(currentPage.value, pageLimit.value); // Cargar nuevos productos para la página seleccionada
                }
        }

        const filteredProducts = computed(() => {
            return searchQuery.value
                ? products.value.filter(product => 
                    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
                )
                : products.value;
        });

        const filterRegisters = () => {
            loading.value = true
            axios.get(`${URL}/supply/register?all=true&startDate=${startDate.value}&endDate=${endDate.value}&productIds=${productFilter.value}`).then( response => {
                products.value = reverseArray(response.data.supply)
                loading.value = false
            })
        }

        onMounted(() => {
            getData(currentPage.value, pageLimit.value);
            axios.get(`http://192.168.1.200:3000/api/inventory/categories`).then(res => {
                console.log(res)
            })
        });

        return {
            products,
            filteredProducts, // Ahora usamos la versión computada
            modalShow,
            modalAddHandler,
            selectedProducts,
            toggleSelection,
            deleteSelected,
            closeAndReload,
            loading,
            searchQuery,
            pagesNumber,
            changePage,
            currentPage,
            modalEdit,
            modalEditHandler,
            toEditProduct,
            startDate,
            endDate,
            filterRegisters,
            productFilter
        };
    }
};
</script>

<style setup>

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.loadingIcon{
    font-size: 80px;
}

.headerTable{
    cursor: pointer;
}

.tableContainer{
    margin-bottom: 5em;
}

.paginacionButtons{
    padding: 0.6em 0.8em;
    background-color: white;
    border: 1px solid #213547;
    border-radius: 3px;
    margin-right: 1em;
    cursor: pointer;
}

.activePagination{
    background-color: #213547;
    color: white;
}

.rowNormal{
    cursor: pointer;
}

.editTd{
    font-size: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.fechas {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 35%;
}

.filtros {
    width: 90vw;
}

.dateInput {
    max-width: 170px;
}

@media(max-width: 768px){
    
}
</style>