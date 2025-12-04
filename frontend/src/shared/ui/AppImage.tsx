import Image, { ImageProps } from 'next/image';

export interface AppImageProps extends Omit<ImageProps, 'quality' | 'placeholder'> {
  quality?: number;
  withBlurPlaceholder?: boolean;
}

export function AppImage({
  quality = 80,
  withBlurPlaceholder = false,
  blurDataURL,
  ...rest
}: AppImageProps) {
  const placeholder = withBlurPlaceholder && blurDataURL ? 'blur' : 'empty';

  return (
    <Image
      {...rest}
      quality={quality}
      blurDataURL={blurDataURL}
      placeholder={placeholder}
    />
  );
}
