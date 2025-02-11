<template>
    <div class="tableDiv">
        <Transition>
        <div class="tableContainer" v-if="!loading">
            <DataTable 
            title="Productos" 
            :columns="[
                { key: 'product_id', label: 'Producto' },
                { key: 'quantity', label: 'Cantidad' },
                { key: 'type_of_quantity', label: 'Precio' },
                { key: 'type', label: 'Tipo' },
                { key: 'weight', label: 'Peso'},
                { key: 'provider', label: 'Proveedor'},
                { key: 'date', label: 'Fecha'},
                { key: 'payed', label: 'Cancelado'},
                { key: 'owed', label: 'Pendiente'},
                { key: 'price', label: 'Precio'}
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
            <ModalEditProducts
            v-if="modalEdit"
            @close-modal="modalEditHandler"
            @closeAndReload="closeAndReload"
            :product="toEditProduct">
            </ModalEditProducts>
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

const URL = "http://localhost:3000/api/inventory";

export default {
    components: {
        ModalProducts,
        ModalEditProducts,
        DataTable,
        ModalRegister
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
            getData();
        };

        const deleteSelected = (productsSelected) => {
            axios.delete(URL, {
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
                axios.get(`${URL}/supply?all=true`)
                .then(response => {
                    products.value = response.data.supply;
                    console.log(response.data)
                    loading.value = false;
                });
            }else{
                axios.get(`${URL}/supply?page=${pages}&limit=${limit}`)
                .then(response => {
                    products.value = response.data.supply;
                    pagesNumber.value = response.data.totalPages
                    loading.value = false;
                    console.log(response.data)
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

        onMounted(() => {
            getData(currentPage.value, pageLimit.value);
            axios.get(`http://localhost:3000/api/inventory/categories`).then(res => {
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
            toEditProduct
        };
    }
};
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
    margin-bottom: 1em;
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
</style>