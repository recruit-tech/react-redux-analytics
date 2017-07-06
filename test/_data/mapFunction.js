export const mapStateToVariables = (state) => ({
  prop10: state.article.title,
  prop30: state.article.content,
  prop40: state.article.author,
  prop50: state.article.category,
  prop51: state.article.language,
  prop60: state.article.links,
})

export const mapPropsToVariables1 = (props, state) => ({
  prop10: props.data10,
  prop31: props.data31,
  prop32: props.data32,
  prop40: props.data40,
  prop50: props.data50,
})

export const mapPropsToVariables2 = (props, state) => ({
  prop10: props.data10,
  prop30: state.article && state.article.title,
  prop31: props.data31,
  prop32: props.data32,
  prop40: (state.article && state.article.author) || props.data40,
  prop41: state.article && state.article.content,
  prop50: props.data50,
})

