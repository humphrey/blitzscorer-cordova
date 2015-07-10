from PIL import Image


def android():

    sizes = {
        '': 128,
        'ldpi': 36,
        'mdpi': 48,
        'hdpi': 72,
        'xhdpi': 96,
        'xxhdpi': 144,
        'xxxhdpi': 192,
    }
    im = Image.open('www/res/icon/android/master.png')
    im = im.convert('RGBA')

    for name, size in sizes.iteritems():
        im2 = im.resize((size, size), Image.LANCZOS)
        if name:
            f = 'www/res/icon/android/icon-%d-%s.png' % (size, name)
        else:
            f = 'www/res/icon/android/icon.png'
        im2.save(f, 'PNG')


def ios():

    sizes = {
        57: [1, 2],
        60: [1, 2, 3],
        72: [1, 2],
        76: [1, 2],
    }
    im = Image.open('www/res/icon/ios/master.png')
    im = im.convert('RGBA')

    for size, multi in sizes.iteritems():
        for m in multi:
            im2 = im.resize((size * m, size * m), Image.LANCZOS)

            if m == 1:
                f = 'www/res/icon/ios/icon-%d.png' % size
            else:
                f = 'www/res/icon/ios/icon-%d@%dx.png' % (size, m)
            im2.save(f, 'PNG')

android()
ios()
