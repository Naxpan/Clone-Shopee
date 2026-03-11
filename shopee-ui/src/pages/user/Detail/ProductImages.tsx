type ProductImagesProps = {
  image: string;
  name: string;
};

function ProductImages({ image, name }: ProductImagesProps) {
  return (
    <div className="product-detail__images">
      <div className="product-detail__image-main">
        <img src={image} alt={name} className="product-detail__image-large" />
      </div>
      {/* Có thể thêm thumbnail images sau */}
    </div>
  );
}

export default ProductImages;
