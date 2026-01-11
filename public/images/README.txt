image docs
==========================

To replace images in the portfolio, simply drop them in this folder with the correct filenames.

1. profile picture
   ----------------
   Drop in your profile picture at this path:
   /public/images/profile.png

   (Supported formats: .png, .jpg, .jpeg)
   *Note: If multiple extensions exist, PNG takes priority in the code logic.*


2. project previews
   ----------------
   Drop in project screenshots at this path:
   /public/images/projects/

   Filename convention:
   preview-{id}.png

   Example:
   If your project ID in 'portfolio.config.ts' is 'task-manager', name the image:
   preview-task-manager.png

   (Supported formats: .png, .jpg, .jpeg)

3. life
   ----------------
   Drop in project screenshots at this path:
   /public/images/life/

   Filename convention:
   {number}.png

   Example:
   for the first life activity, name the image:
   1.png, for the second, name it 2.png, and so on.

   (Supported formats: .png, .jpg, .jpeg)


4. customization
   -------------
   you can override the default images by changing 'portfolio.config.ts' directly if you prefer specific URLs.
