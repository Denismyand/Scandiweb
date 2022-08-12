import { useDispatch } from "react-redux";


export function ProductAttributes({ product, styles }) {

  const dispatch = useDispatch();

  function handleSelectAttribute(product, attribute, id) {
    dispatch({ type: "selectAttribute", payload: {product, attribute, id} });
  }
  
  function differAttributes(attribute) {
    return (
      <>
        <p className={styles.attributeName}>{attribute.name.toUpperCase()}:</p>
        {attribute.type === "text" &&
          attribute.items.map((item) => {
            return (
              <button
                className={
                  item.selectedItem
                    ? styles.activeTextAttributeSelectButton
                    : styles.textAttributeSelectButton
                }
                key={item.id}
                onClick={() =>
                  handleSelectAttribute(product, attribute, item.id)
                }
              >
                {item.value}
              </button>
            );
          })}
        {attribute.type === "swatch" &&
          attribute.items.map((item) => {
            return (
              <button
                className={
                  item.selectedItem
                    ? styles.activeSwatchAttributeSelectButton
                    : styles.swatchAttributeSelectButton
                }
                key={item.id}
                style={{
                  backgroundColor: `${item.value}`,
                }}
                onClick={() =>
                  handleSelectAttribute(product, attribute, item.id)
                }
              />
            );
          })}
      </>
    );
  }
  return (
    <>
      {product.attributes.map((attribute) => {
        return <div key={attribute.id}>{differAttributes(attribute)}</div>;
      })}
    </>
  );
}

