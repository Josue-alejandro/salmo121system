<template>
    <div class="titleDiv">
        <h5>Productos</h5>
    </div>
    <div class="tableDiv">
        <div class="botones">
            <button class="btn blue darken-1" @click="modalAddHandler"><i class="material-icons">add</i></button>
            <button class="btn red darken-4" @click="deleteSelected"><i class="material-icons">delete</i></button>
            <div class="input-field col s6">
                <input 
                id="first_name" 
                type="text" 
                class="validate"
                v-model="searchQuery"
                placeholder="Buscar...">
            </div>
        </div>
        <Transition>
        <div class="tableContainer" v-if="!loading">
            <table>
                <thead>
                    <tr>
                        <th @click="sortByProperty('name')" class="headerTable">Nombre</th>
                        <th @click="sortByProperty('stock')" class="headerTable">Existencia</th>
                        <th @click="sortByProperty('category')" class="headerTable">Categoría</th>
                        <th @click="sortByProperty('price')" class="headerTable">Precio</th>
                        <th @click="sortByProperty('price_type')" class="headerTable">Tipo</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in filteredProducts" :key="product.id" 
                    :class="{ selected: selectedProducts.includes(product.id),
                              rowNormal: true
                    }" 
                    @click="toggleSelection(product.id)">
                    <td>{{ product.name }}</td>
                    <td>{{ product.stock }}</td>
                    <td>{{ product.category }}</td>
                    <td>{{ product.price }} Bs</td>
                    <td>{{ product.price_type }}</td>
                    <td 
                    class="editTd">
                    <i 
                    @click="modalEditHandler(product)"
                    class="material-icons">edit</i></td>
                    </tr>
                </tbody>
            </table>
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

const URL = "http://localhost:3000/api/inventory/products";

export default {
    components: {
        ModalProducts,
        ModalEditProducts
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

        const sortOrder = ref('desc');
        const currentSortProperty = ref(null);

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

        const deleteSelected = () => {
            axios.delete(URL, {
                data: { ids: selectedProducts.value },
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

        const sortByProperty = (property) => {
            if (currentSortProperty.value === property) {
                sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortOrder.value = 'desc';
                currentSortProperty.value = property;
            }

            products.value = [...products.value].sort((a, b) => {
                let valueA = a[property];
                let valueB = b[property];

                if (typeof valueA === "number" && typeof valueB === "number") {
                    return sortOrder.value === 'asc' ? valueA - valueB : valueB - valueA;
                }

                if (typeof valueA === "string" && typeof valueB === "string") {
                    return sortOrder.value === 'asc' 
                        ? valueA.localeCompare(valueB) 
                        : valueB.localeCompare(valueA);
                }

                return 0;
            });
        };

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
            sortByProperty,
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