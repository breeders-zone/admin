import React, {PureComponent, useCallback, useState} from "react";
import Dropzone, {useDropzone} from "react-dropzone";
import ReactCrop, {Crop} from "react-image-crop";
import {CustomCrop, ImageCropProps, ImageCropState} from "./types";

class ImageCrop extends PureComponent<ImageCropProps, ImageCropState>{

    state: Readonly<ImageCropState> = {
        src: '',
        file: null,
        croppedImageUrl: '',
        realCrop: null,
        crop:  {
            unit: '%',
            width: 30,
            aspect: this.props.aspect,
            src: ''
        } as Crop
    };
    imageRef: any = null;
    fileUrl = '';

    clearState = () => {
        this.setState({
            src: '',
            file: null,
            croppedImageUrl: '',
            realCrop: null,
            crop:  {
                unit: '%',
                width: 30,
                aspect: this.props.aspect,
            } as Crop
        });
    };

    onDrop = (acceptedFiles: Array<File>) => {
        this.setState({
            file: acceptedFiles[0],
            src: URL.createObjectURL(acceptedFiles[0])
        });
    };

    // If you setState the crop in here you should return false.
    onImageLoaded = (image: any) => {
        this.imageRef = image;
    };

    onCropComplete = (crop: any) => this.makeClientCrop(crop);

    onCropChange = (crop: Crop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop: crop });
    };

    async makeClientCrop(crop: Crop & CustomCrop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop
            );

            const scaleX = this.imageRef.naturalWidth / this.imageRef.width;
            const scaleY = this.imageRef.naturalHeight / this.imageRef.height;

            this.setState({ croppedImageUrl });
            const newCrop: CustomCrop = {
                x: Math.ceil(crop.x * scaleX),
                y: Math.ceil(crop.y * scaleY),
                width: this.props.aspect === 1 ? Math.ceil(crop.height * scaleY) : Math.ceil(crop.width * scaleX),
                height: Math.ceil(crop.height * scaleY),
                src: this.state.file,
                url: croppedImageUrl
            };

            this.setState({realCrop: newCrop});
        }
    }

    getCroppedImg(image: any, crop: Crop & CustomCrop): Promise<string> {
        const canvas: any = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob: any) => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, 'image/jpeg');
        });
    }

   render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
       const {src, crop, realCrop} = this.state;
       return (
           <React.Fragment>
               <p className="text-center mb-3">
                   {
                       !src ?
                           'Вы можете загрузить изображение в формате JPG, GIF или PNG.'
                           : 'Выберете область фотографии.'
                   }
               </p>
               <Dropzone
                   onDrop={this.onDrop}
                   multiple={false}
                   accept="image/jpeg, image/png, image/svg"
               >
                   {
                       ({getRootProps, getInputProps}) => (
                            <React.Fragment>
                                {
                                    !src &&
                                        <div {...getRootProps({ className: 'p-3 m-0 mb-2 rounded shadow w-100'})}>
                                            <input {...getInputProps({
                                                name: 'logo',
                                                className: 'drag-and-drop-input'
                                            })}/>
                                            <div className="d-flex outline text-center">
                                                <span className="m-auto">Перетащите файлы сюда,<br/>либо кликните для выбора</span>
                                            </div>
                                        </div>
                                }
                            </React.Fragment>
                       )
                   }
               </Dropzone>

               {
                   src &&
                       <ReactCrop
                           src={src}
                           crop={crop}
                           ruleOfThirds
                           onImageLoaded={this.onImageLoaded}
                           onComplete={this.onCropComplete}
                           onChange={this.onCropChange}
                       />
               }

               {
                   src &&
                       <div className="d-flex align-items-center">
                           <button className="btn btn-primary mr--10" onClick={() => this.props.onComplete(realCrop)}>Сохранить</button>
                           <button className="btn btn-gray" onClick={this.clearState}>Вернуться назад</button>
                       </div>
               }
           </React.Fragment>
       );
   }
}

export default ImageCrop;
