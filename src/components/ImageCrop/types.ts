import {Crop} from "react-image-crop";

export interface CustomCrop {
    unit?: "px"|"%",
    url?: string,
    aspect?: number,
    x: number,
    y: number,
    width: number,
    height: number,
    src: File|null
}

export interface ImageCropProps {
    aspect: number,
    onComplete: (corp: Crop|null) => void,
}

export interface ImageCropState {
    src: string,
    file: File|null,
    crop: Crop,
    realCrop: CustomCrop|null,
    croppedImageUrl: string
}
