import jsmin

def minify_js(input_path, output_path):
    with open(input_path, 'r') as input_file:
        js = input_file.read()
    
    minified = jsmin.jsmin(js)
    
    with open(output_path, 'w') as output_file:
        output_file.write(minified)

# Usage
minify_js('assets/js/include-html.js', 'assets/js/include-html.min.js')