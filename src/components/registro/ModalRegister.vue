<template>
    <div class="fade">
        <div class="modalFrame card">
            <form action="#" method="post">
                <label for="fecha">Fecha:</label>
                <input type="date" id="fecha" name="fecha" required>
                
                
                <input class="btn" type="submit" value="Guardar">
            </form>
        </div>
    </div>
</template>

<style>
.fade{
    position: absolute;
    background-color: rgba(56, 56, 56, 0.541);
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vw;
    display: flex;
    justify-content: center;
    padding-top: 3em;
}

.modalFrame {
    background-color: rgb(255, 255, 255);
    width: 80%;
    border-radius: 10px;
    padding: 2em;
    height: 700px;
}
</style>