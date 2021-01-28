let model;
let soilmodel;
let class_indices;
let soil_classes;

let fileUpload = document.getElementById('uploadImage')
let img = document.getElementById('image')

let fileUploadsoil = document.getElementById('uploadImageSoil')
let imgsoil = document.getElementById('imagesoil')

let boxResult = document.querySelector('.box-result')
let confidence = document.querySelector('.confidence')
let pconf = document.querySelector('.box-result p')

let boxResultsoil = document.querySelector('.box-resultsoil')
let confidencesoil = document.querySelector('.confidencesoil')
let pconfsoil = document.querySelector('.box-resultsoil p')

let progressBar =
            new ProgressBar.Circle('#progress', {
            color: 'limegreen',
            strokeWidth: 10,
            duration: 2000, // milliseconds
            easing: 'easeInOut'
        });

        // fetch plant data
        async function fetchPlantData(){
            let responsePlant = await fetch('./class_indices.json');
            let dataPlant = await responsePlant.json();
            dataPlant = JSON.stringify(dataPlant);
            dataPlant = JSON.parse(dataPlant);
            return dataPlant;
        }
        // fetch soil data
        async function fetchSoilData(){
            let responseSoil = await fetch('./soil_classes.json');
            let dataSoil = await responseSoil.json();
            dataSoil = JSON.stringify(dataSoil);
            dataSoil = JSON.parse(dataSoil);
            return dataSoil;
        }
        // initializePlant/Load model
        async function initializePlant() {
            let status = document.querySelector('.init_status')
            status.innerHTML = 'Loading Plant Model .... <span class="fa fa-spinner fa-spin"></span>'
            model = await tf.loadLayersModel('./tensorflowjs-model');
            status.innerHTML = 'Plant Model Loaded Successfully  <span class="fa fa-check"></span>'

        }
        // initializeSoil/Load model
        async function initializeSoil() {
            let status = document.querySelector('.init_statusSoil')
            status.innerHTML = 'Loading Soil Model .... <span class="fa fa-spinner fa-spin"></span>'
            soilmodel = await tf.loadModel('./soilnet');
            status.innerHTML = 'Soil Model Loaded Successfully  <span class="fa fa-check"></span>'

        }
        //plant Predcation
        async function predict() {
            // Function for invoking prediction
            let img = document.getElementById('image')
            let offset = tf.scalar(255)
            let tensorImg =   tf.browser.fromPixels(img).resizeNearestNeighbor([224,224]).toFloat().expandDims();
            let tensorImg_scaled = tensorImg.div(offset)
            prediction = await model.predict(tensorImg_scaled).dataPlant();

            fetchPlantData().then((dataPlant)=>
                {
                    predicted_class = tf.argMax(prediction)

                    class_idx = Array.from(predicted_class.dataSync())[0]
                    document.querySelector('.pred_class').innerHTML = dataPlant[class_idx]
                    document.querySelector('.inner').innerHTML = `${parseFloat(prediction[class_idx]*100).toFixed(2)}% SURE`
                    console.log(dataPlant)
                    console.log(dataPlant[class_idx])
                    console.log(prediction)

                    progressBar.animate(prediction[class_idx]-0.005); // percent

                    pconf.style.display = 'block'

                    confidence.innerHTML = Math.round(prediction[class_idx]*100)

                }
            );

        }
        // Soil Predcation
        async function predictSoil() {
            // Function for invoking prediction
            let img = document.getElementById('imagesoil')
            let offset = tf.scalar(255)
            let tensorImg =   tf.browser.fromPixels(img).resizeNearestNeighbor([224,224]).toFloat().expandDims();
            let tensorImg_scaled = tensorImg.div(offset)

            soilprediction = await model.predict(tensorImg_scaled).dataSoil();

            fetchPlantData().then((dataSoil)=>
                {
                    predicted_class = tf.argMax(soilprediction)

                    class_idx = Array.from(predicted_class.dataSync())[0]
                    document.querySelector('.soil_classes').innerHTML = dataSoil[class_idx]
                    document.querySelector('.inner').innerHTML = `${parseFloat(soilprediction[class_idx]*100).toFixed(2)}% SURE`
                    console.log(dataSoil)
                    console.log(dataSoil[class_idx])
                    console.log(soilprediction)

                    progressBar.animate(soilprediction[class_idx]-0.005); // percent

                    pconfsoil.style.display = 'block'

                    confidencesoil.innerHTML = Math.round(soilprediction[class_idx]*100)

                }
            );

        }
        //plant upload
        fileUpload.addEventListener('change', function(e){

            let uploadedImage = e.target.value
            if (uploadedImage){
                document.getElementById("blankFile-1").innerHTML = uploadedImage.replace("C:\\fakepath\\","")
                document.getElementById("choose-text-1").innerText = "Change Selected Image"
                document.querySelector(".success-1").style.display = "inline-block"

                let extension = uploadedImage.split(".")[1]
                if (!(["doc","docx","pdf"].includes(extension))){
                    document.querySelector(".success-1 i").style.border = "1px solid DarkSlateGray"
                    document.querySelector(".success-1 i").style.color = "DarkSlateGray"
                }else{
                    document.querySelector(".success-1 i").style.border = "1px solid rgb(25,110,180)"
                    document.querySelector(".success-1 i").style.color = "rgb(25,110,180)"
                }
            }
            let file = this.files[0]
            if (file){
                boxResult.style.display = 'block'
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.addEventListener("load", function(){

                    img.style.display = "block"
                    img.setAttribute('src', this.result);
                });
            }

            else{
            img.setAttribute("src", "");
            }

            initializePlant().then( () => {
                predict()
            })
        })
        // Soil upload
        fileUploadsoil.addEventListener('change', function(e){

            let uploadedImagesoil = e.target.value
            if (uploadedImagesoil){
                document.getElementById("blankFile-2").innerHTML = uploadedImagesoil.replace("C:\\fakepathsoil\\","")
                document.getElementById("choose-text-2").innerText = "Change Selected Image"
                document.querySelector(".success-3").style.display = "inline-block"

                let extension = uploadedImagesoil.split(".")[1]
                if (!(["doc","docx","pdf"].includes(extension))){
                    document.querySelector(".success-3 i").style.border = "1px solid DarkSlateGray"
                    document.querySelector(".success-3 i").style.color = "DarkSlateGray"
                }else{
                    document.querySelector(".success-3 i").style.border = "1px solid rgb(25,110,180)"
                    document.querySelector(".success-3 i").style.color = "rgb(25,110,180)"
                }
            }
            let filesoil = this.files[0]
            if (filesoil){
                boxResultsoil.style.display = 'block'
                const readersoil = new FileReader();
                readersoil.readAsDataURL(filesoil);
                readersoil.addEventListener("load", function(){

                    imgsoil.style.display = "block"
                    imgsoil.setAttribute('src', this.result);
                });
            }

            else{
            imgsoil.setAttribute("src", "");
            }

            initializeSoil().then( () => {
                predictSoil()
            })
        })
