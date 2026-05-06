tinymce.init({
  selector: 'textarea.tinymce',
  license_key: 'gpl',

  plugins: [
    'image',
    'link',
    'lists',
    'table',
    'code',
    'emoticons',
    'charmap',
    'media',
    'wordcount'
  ],

  toolbar:
    'undo redo | blocks fontfamily fontsize | ' +
    'bold italic underline strikethrough | forecolor backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | ' +
    'link image media table emoticons | code',

  menubar: true
});