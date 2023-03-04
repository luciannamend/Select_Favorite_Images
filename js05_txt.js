"use strict";
window.addEventListener("load", setupGallery);

function setupGallery() {
   let imageCount = imgFiles.length;
   let galleryBox = document.getElementById("lightbox");
   let currentSlide = 1;
   let runShow = true;
   let showRunning;
   
   let galleryTitle = document.createElement("h1");
   galleryTitle.id = "galleryTitle";
   let slidesTitle = lightboxTitle; // TODO figure out title
   galleryTitle.textContent = slidesTitle;
   galleryBox.appendChild(galleryTitle);
   
   let slideCounter = document.createElement("div");
   slideCounter.id = "slideCounter";
   slideCounter.textContent = currentSlide + "/" + imageCount;
   galleryBox.appendChild(slideCounter);
   
   let leftBox = document.createElement("div");
   leftBox.id = "leftBox";
   leftBox.innerHTML = "&#9664;";
   leftBox.onclick = moveToLeft;   
   galleryBox.appendChild(leftBox);
   
   let rightBox = document.createElement("div");
   rightBox.id = "rightBox";
   rightBox.innerHTML = "&#9654;";  
   rightBox.onclick = moveToRight;   
   galleryBox.appendChild(rightBox);
   
   let playPause = document.createElement("div");
   playPause.id = "playPause";
   playPause.innerHTML = "&#9199;";
   playPause.onclick = startStopShow;
   galleryBox.appendChild(playPause);
   
   let slideBox = document.createElement("div");
   slideBox.id = "slideBox";
   galleryBox.appendChild(slideBox);
   
   
   for (let i = 0; i < imageCount; i++) {
      let image = document.createElement("img");
      image.src = imgFiles[i];
      image.alt = imgCaptions[i];
      image.onclick = createModal;
      slideBox.appendChild(image);
   }

   function moveToRight() {
      let firstImage = slideBox.firstElementChild.cloneNode("true");
      firstImage.onclick = createModal;
      slideBox.appendChild(firstImage);
      slideBox.removeChild(slideBox.firstElementChild);
      currentSlide++;
      if (currentSlide > imageCount) {
         currentSlide = 1;
      }
      slideCounter.textContent = currentSlide + " / " + imageCount;
   }
   
   function moveToLeft() {
      let lastImage = slideBox.lastElementChild.cloneNode("true");
      lastImage.onclick = createModal;
      slideBox.removeChild(slideBox.lastElementChild);
      slideBox.insertBefore(lastImage, slideBox.firstElementChild);
      currentSlide--;
      if (currentSlide === 0) {
         currentSlide = imageCount;
      }
      slideCounter.textContent = currentSlide + " / " + imageCount;      
   }  
   
   function startStopShow() {
      if (runShow) {
         showRunning = window.setInterval(moveToRight, 2000);
         runShow = false;
      } else {
         window.clearInterval(showRunning);
         runShow = true;
      }
   }
   
   function createModal() {
      let modalWindow = document.createElement("div");
      modalWindow.id = "activeModal";
      
      let figureBox = document.createElement("figure");
      modalWindow.appendChild(figureBox);
      
      let modalImage = this.cloneNode("true");
      figureBox.appendChild(modalImage);
      
      let figureCaption = document.createElement("figcaption");
      figureCaption.textContent = modalImage.alt;
      figureBox.appendChild(figureCaption);
      
      let closeBox = document.createElement("div");
      closeBox.id = "modalClose";
      closeBox.innerHTML = "Close";
      closeBox.onclick = function() {
         document.body.removeChild(modalWindow);
      }
      
      modalWindow.appendChild(closeBox); 

      document.body.appendChild(modalWindow);

      addToFavorite(modalWindow, modalImage);
      const rootNode = closeBox.getRootNode();
      //console.log('aqui é root node:', rootNode);
      document.body.appendChild(modalWindow);
   }

   const addToFavorite = (modalW, imageToClone) => {      
      
      let addBox = document.createElement("div");
      addBox.id = "addBox";
      addBox.innerHTML = "Add to favorites";
      
      addBox.onclick = function() {     //adding img to fav area
         
         const favImage = imageToClone.cloneNode("true");     //cloned img   

         const myFavouriteImages = document.getElementById("myFavoriteImages");  //creates fav area
         
         const myFavouriteImagesMaxLength = 5; //max imgs allowed

         const imageAndButtonWrapper = document.createElement("div");  //creates a div to include img and remove btn
         imageAndButtonWrapper.id = "imageAndButtonWrapper";      

         const allImages = document.querySelectorAll('.favImageClass');   

         const favImageId = "favImage" + allImages.length   //creates an unique id for each img added
         favImage.id = favImageId;   
         favImage.classList.add('favImageClass'); 

         //appends img and btn div into fav area     
         myFavouriteImages.appendChild(imageAndButtonWrapper); 

         //iteration in favorite are to check for duplication
         for(let i = 0; i < allImages.length; i++){

            //if duplicated, exibit alert
            if (allImages[i].src === favImage.src){
               alert('Duplication: This image was already .');
               return;
            }
         }  
         
         // If more than 5 images, exibit alert
         if (allImages.length >= myFavouriteImagesMaxLength){
            alert("You can only add five images maximum. Please, remove from your favorites' list before adding a new one.");
            return;
         }                
         //if less than 5 image and not duplicated, then append
         imageAndButtonWrapper.appendChild(favImage);
         
         //an element for each img added based on unique id
         let favImageElement = document.getElementById(favImageId);

         //clicking on the fav img on my fav area
         favImageElement.onclick = function(){        

            // grabs any existent button
            const currentRemoveBtns = document.getElementsByClassName("favImageRemoveButton");
            
            //if a preview button exists, remove
            if (currentRemoveBtns.length > 0){               
               currentRemoveBtns[0].remove();               
            }

            //creates a button to remove fav img
            let favImageRemoveButton = document.createElement("input");  
            favImageRemoveButton.id = "favImageRemoveButton" + favImageId;
            favImageRemoveButton.type = "button";
            favImageRemoveButton.value = "Remove"
            favImageRemoveButton.style.visibility = "hidden";
            favImageRemoveButton.classList.add("favImageRemoveButton");

            //attach button to the imgButtonWrapper            
            imageAndButtonWrapper.appendChild(favImageRemoveButton);         
                  
            //mas btn visible when user clicks on the img
            favImageRemoveButton.style.visibility = "visible";   
            
            //remove fav img and button from fav imgs area
            favImageRemoveButton.onclick = function(){
               favImageElement.remove();
               favImageRemoveButton.remove();
            }         
         }         
      }            

      modalW.appendChild(addBox);

   }
};
