<template>
    <div class="tableDiv">
        <Transition>
        <div class="tableContainer" v-if="!loading">
            <button class="btn" @click="getData(null, null)">Ver todo</button>
            <DataTable 
            title="Productos" 
            :columns="[
                { key: 'name', label: 'Nombre' },
                { key: 'stock', label: 'Existencia' },
                { key: 'category', label: 'Categoría' },
                { key: 'price', label: 'Precio' },
                { key: 'price_type', label: 'Tipo' }
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
            <ModalProducts 
            v-if="modalShow"
            @close-modal="modalAddHandler"
            @closeAndReload="closeAndReload">
            </ModalProducts>
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

const URL = "http://192.168.1.200:3000/api/inventory/products";

export default {
    components: {
        ModalProducts,
        ModalEditProducts,
        DataTable
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
                console.log(modalEdit.value)
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
            modalEdit.value = false
            console.log("hola")
            getData(null, null);
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
                axios.get(`${URL}?all=true`)
                .then(response => {
                    products.value = response.data.products;
                    console.log(response.data)
                    loading.value = false;
                });
            }else{
                axios.get(`${URL}?page=${pages}&limit=${limit}`)
                .then(response => {
                    products.value = response.data.products;
                    console.log(response.data)
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
            getData
        };
    }
};
</script>

<style setup>
.tableDiv{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
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