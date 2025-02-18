<template>
    <div class="tableDiv">
        <div class="botones">
            <button class="btn blue darken-1" @click="$emit('add')">
                <i class="material-icons">add</i>
            </button>
            <button class="btn red darken-4" @click="$emit('delete', selectedItems)">
                <i class="material-icons">delete</i>
            </button>
            <div class="input-field col s6" v-if="searchable">
                <input 
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
                            <th v-for="column in columns" :key="column.key" @click="sortable ? sortByProperty(column.key) : null" 
                                class="headerTable">
                                {{ column.label }}
                            </th>
                            <th>Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredItems" :key="item.id" 
                            :class="{ selected: selectedItems.includes(item.id), rowNormal: true }" 
                            @click="toggleSelection(item.id)">
                            <td v-for="column in columns" :key="column.key">{{ item[column.key] }}</td>
                            <td class="editTd">
                                <i class="material-icons" @click="$emit('edit', item)">edit</i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <div class="loading">
                    <i class="material-icons loadingIcon">hourglass_empty</i>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
    props: {
        title: String,
        columns: Array,
        data: Array,
        loading: Boolean,
        searchable: Boolean,
        sortable: Boolean
    },
    emits: ['edit', 'delete', 'add'],
    setup(props) {
        const searchQuery = ref('');
        const selectedItems = ref([]);
        const currentSortProperty = ref('');
        const sortOrder = ref('asc');  // 'asc' o 'desc'

        const filteredItems = computed(() => {
            let items = [...props.data]; // Copiamos los datos para no mutarlos directamente

            if (searchQuery.value) {
                items = items.filter(item => 
                    Object.values(item).some(value => 
                        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
                    )
                );
            }

            // Aplicamos la ordenación si es necesario
            if (currentSortProperty.value) {
                items.sort((a, b) => {
                    let valueA = a[currentSortProperty.value];
                    let valueB = b[currentSortProperty.value];

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
            }

            return items;
        });

        const sortByProperty = (property) => {
            if (currentSortProperty.value === property) {
                sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortOrder.value = 'desc';
                currentSortProperty.value = property;
            }
        };

        const toggleSelection = (id) => {
            const index = selectedItems.value.indexOf(id);
            if (index === -1) {
                selectedItems.value.push(id);
            } else {
                selectedItems.value.splice(index, 1);
            }
        };

        return {
            searchQuery,
            selectedItems,
            filteredItems,
            sortByProperty,
            toggleSelection
        };
    }
};
</script>

<style scoped>
th, td{
    padding: 0.7em 1em;
    white-space: nowrap; /* Evita que el texto se desborde */
    text-align: left;
}

th{
    background-color: #213547;
    color: white;
    border-radius: 0px;
}

table{
    width: 90vw;
    margin-bottom: 1em;
    min-width: 600px; /* Asegura que la tabla no se colapse en pantallas pequeñas */
    border-collapse: collapse;
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
    align-items: center;
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

.loadingIcon{
    font-size: 80px;
}

.headerTable{
    cursor: pointer;
}

.tableContainer{
    margin-bottom: 5em;
    overflow-x: auto; /* Permite el scroll en pantallas pequeñas */
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

/* Estilos para dispositivos móviles */
@media (max-width: 768px) {
    .tableDiv {
        align-items: flex-start;
    }

    .tableContainer {
        width: 100%;
        overflow-x: auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    table {
        display: block;
        overflow-x: auto;
        min-width: 95%;
    }

    th, td {
        padding: 0.5em;
        font-size: 0.9em;
    }

    .botones {
        flex-direction: column;
    }
}
</style>