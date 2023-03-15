def save_to_file(file_name, colors):

    file = open(f"{file_name}.csv", "w")
    file.write("hex,rgb,hsl,distance,lightness\n")

    for color in colors:
        file.write(
            f"{color['color_hex']},{color['color_rgb']},{color['color_hsl']},{color['color_distance']},{color['color_lightness']}\n"
        )

    file.close()
