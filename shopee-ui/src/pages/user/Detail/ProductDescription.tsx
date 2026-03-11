function ProductDescription({ description }: { description: string }) {
  if (!description) {
    return null;
  }

  return (
    <div className="product-detail__description">
      <h2 className="description-heading">Mô tả sản phẩm</h2>
      <div className="description-content">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default ProductDescription;
