import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import CardProduct from "src/components/products/CardProduct";
import { Product } from "src/data/products";
import { ListIdAccountProductsResponse } from "src/models/Product";
import Section from "../../SectionProduct";

interface ProductOtherProps {
  productId?: number;
  relativeProduct?: Product[];
  isFavorite?: boolean;
  isSaveLater?: boolean;
  favouriteProductIds?: ListIdAccountProductsResponse | null;
  buyLaterProductIds?: ListIdAccountProductsResponse | null;
}

const ProductOther = ({
  relativeProduct,
  buyLaterProductIds,
  favouriteProductIds,
  productId,
  ...props
}: ProductOtherProps) => {
  const { t } = useTranslation();
  const { isFavorite, isSaveLater } = props;

  return (
    <div id="product-others">
      <Section title={t("products:moreSimilarProduct")} expand={<></>}>
        <Row align="middle" gutter={[16, 32]}>
          {relativeProduct?.map((product: Product) => {
            if (product.id !== productId) {
              return (
                <Col key={product.name + "-" + product.id} md={8} span={12}>
                  <CardProduct
                    {...product}
                    isFavorite={isFavorite}
                    isSaveLater={isSaveLater}
                    showActionBar={true}
                    isFavorIcon={favouriteProductIds?.data.includes(
                      Number(product.id)
                    )}
                    isSaveLaterIcon={buyLaterProductIds?.data.includes(
                      Number(product.id)
                    )}
                  />
                </Col>
              );
            }
          })}
        </Row>
        {/* <Row align="middle" gutter={[16, 32]}>
          {listProduct.slice(0, 6).map((product: Product) => (
            <Col key={product.id} md={8} span={12}>
              <CardProduct {...product} />
            </Col>
          ))}
        </Row> */}
      </Section>
    </div>
  );
};

export default ProductOther;
