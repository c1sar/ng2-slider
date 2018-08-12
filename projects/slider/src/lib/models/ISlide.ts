import { IButton } from "./IButton";

export interface ISlide {
  img: string;
  alt?: string;
  title?: string;
  html?: string;
  description?: string;
  button?: IButton;
  className?: string;
}
