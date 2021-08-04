import React from 'react';
import styled from '@emotion/styled';

/**
@examples
<Article>{data}</Article>
*/
const Article = React.forwardRef(({ ...rest }, ref) => {
  const objStyle = {
    fontFamily:
      '"Noto Serif","Times New Roman", "Noto Color Emoji","Font Awesome 5 Free","Noto Serif CJK SC","PingFang SC","Microsoft Yahei",serif',
    letterSpacing: '1px',
    ...rest.style,
  };

  const Styled = styled.article(objStyle);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Styled {...rest} ref={ref} />;
});

export default Article;
