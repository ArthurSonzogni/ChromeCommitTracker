git ls-tree --full-tree --name-only -r HEAD \
  | grep -v "test" \
  | grep -v "codelabs" \
  | grep -v "/tools" \
  | grep "\\.h\\|\\.cc"
