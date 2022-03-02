import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Department, Type, Size, Brand, Variant, Group } from 'src/app/_models/sku'
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';
import { ValueTransformer } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {

  tagItems = [];

  @ViewChild('f', { static: false }) f: NgForm;
  @ViewChild('img', { static: false }) image: ElementRef;

  private defualtImage = "assets/images/pro3/1.jpg";
  public loaded: boolean = false;
  public imageError: boolean = false;
  public imageMessage: string = "";
  public url = {
    img: this.defualtImage,
  }

  public user: User;

  public departments: Department[] = [];
  public types: Type[] = [];
  public groups: Group[] = [];
  public variants: Variant[] = [];
  public filteredVariants: Variant[] = [];
  public brands: Brand[] = [];
  public sizes: Size[] = [];


  public variantCounter = 1;
  public variantArray = ["null"];
  public sizeCounter = 1;
  public sizeArray = ["null"];
  public groupCounter = 1;
  public groupArray = ["null"];
  public defaultGroupValue: string;

  public imageArray = ["null"];
  public imageCounter = 1;
  public images = [this.defualtImage];
  public imagesErrors = [false];
  public imagesErrorsMessages = ["null"];
  public imagesValid = [false];

  constructor(private fb: FormBuilder, private http: HttpClient, private appAuthService: AppAuthenticationService, private toastr: ToastrService, @Inject(DOCUMENT) private document: Document, private router: Router) { }


  ngOnInit() {

    this.appAuthService.tokenAuthenticate(() => {

      this.user = this.appAuthService.getAuthUser();

      let url = environment.API_URL + "/skus";

      this.http.get(url, {
        headers: this.appAuthService.getAuthHeader(),
        observe: 'response'
      }).subscribe(
        success => {
          console.log("Successfully fetched skus");

          let departments = success.body['departments'];
          let sizes = success.body['sizes'];
          let types = success.body['types'];
          let variants = success.body['variants'];
          let brands = success.body['brands'];
          let groups = success.body['groups'];

          departments.forEach(element => {
            let department = Department.fromJSON(element);
            this.departments.push(department);
          });

          sizes.forEach(element => {
            let size = Size.fromJSON(element);
            this.sizes.push(size);
          });

          types.forEach(element => {
            let type = Type.fromJSON(element);
            this.types.push(type);
          });

          variants.forEach(element => {
            let variant = Variant.fromJSON(element);
            this.variants.push(variant);
          });

          brands.forEach(element => {
            let brand = Brand.fromJSON(element);
            this.brands.push(brand);
          });

          groups.forEach(element => {
            let group = Group.fromJSON(element);
            this.groups.push(group);
          });

          let defaultGroup = this.groups.filter(element => (element.name == "Everything"));
          this.defaultGroupValue = defaultGroup[0]._id;

          this.loaded = true;

        },
        error => {
          // do something
          console.log("Error fetching skues");
          console.log(error);
          this.toastr.error("Error loading page. Please refresh", "Error!");
        });
    });
  }

  //FileUpload
  readUrl(event: any) {
    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      var image = new Image();
      image.src = reader.result.toString();

      image.onload = () => {

        if ((image.height != 736) || (image.width != 736)) {
          this.imageError = true;
          this.imageMessage = "Error! Please make sure your image is 736x736px";
          this.image.nativeElement.value = "";
          this.url.img = this.defualtImage;
        } else {
          this.imageError = false;
          this.imageMessage = "";
          this.url.img = image.src;
        }
      }
    }
  }

  readFile(event: any, i: number) {
    if (event.target.files.length === 0) {
      this.imagesErrors[i] = true;
      this.imagesErrorsMessages[i] = "Please make sure you selecet a file.";
      return;
    }

    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.imagesErrors[i] = true;
      this.imagesErrorsMessages[i] = "Please make sure you select an image file."
      return;
    }

    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      var image = new Image();
      image.src = reader.result.toString();

      image.onload = () => {

        if ((image.height != 736) || (image.width != 736)) {
          this.imagesErrors[i] = true;
          this.imagesErrorsMessages[i] = "Error! Please make sure your image is 736x736px";
          let id = "imageinput_" + i.toString();
          (<HTMLInputElement>document.getElementById(id)).value = "";
          this.images[i] = this.defualtImage;
        } else {
          this.imagesErrors[i] = false;
          this.imagesErrorsMessages[i] = "null";
          this.images[i] = image.src;
          this.imagesValid[i] = true;
        }
      }
    }

  }

  incrementImage() {
    this.imageCounter++;
    this.imageArray.push("null");
    this.images.push(this.defualtImage);
    this.imagesErrors.push(false);
  }

  decrementImage() {
    this.imageCounter--;
    this.imageArray.pop();
    this.images.pop();
    this.imagesErrors.pop();
  }

  incrementVariant() {
    this.variantCounter++;
    this.variantArray.push("null");
  }

  decrementVariant() {
    this.variantCounter--;
    this.variantArray.pop();
  }

  incrementSize() {
    this.sizeCounter++;
    this.sizeArray.push("null");
  }

  decrementSize() {
    this.sizeCounter--;
    this.sizeArray.pop();
  }

  incrementGroup() {
    this.groupCounter++;
    this.groupArray.push("null");
  }

  decrementGroup() {
    this.groupCounter--;
    this.groupArray.pop();
  }

  onSubmit() {

    let params = this.f.value;

    let variants = [];
    for (let i = 0; i < this.variantCounter; i++) {
      let id = "variant_" + i.toString();
      let value = (<HTMLInputElement>document.getElementById(id)).value;
      if (value != "") {
        variants.push(value);
      }
    }

    let sizes = [];
    for (let i = 0; i < this.sizeCounter; i++) {
      let id = "size_" + i.toString();
      let value = (<HTMLInputElement>document.getElementById(id)).value;
      if (value != "") {
        sizes.push(value);
      }
    }

    let groups = [];
    for (let i = 0; i < this.groupCounter + 1; i++) {
      let id = "group_" + i.toString();
      let value = (<HTMLInputElement>document.getElementById(id)).value;
      if (value != "") {
        groups.push(value);
      }
    }

    let tags = params["tags-in"].split(" ");
    params["tags"] = tags;

    if (variants.length > 0) {
      params["variants"] = variants;
    }

    if (sizes.length > 0) {
      params["sizes"] = sizes;
    }

    if (groups.length > 0) {
      params["groups"] = groups;
    }

    params["user"] = this.user._id;

    console.log(params);

    let file = (<HTMLInputElement>document.getElementById('image')).files[0];
    let filename = (<HTMLInputElement>document.getElementById('image')).value;

    const formData = new FormData();
    formData.set("photo", file, filename);
    formData.set("alt", "Product Photo");

    this.http.post(environment.API_URL + "/product", params, { headers: this.appAuthService.getAuthHeader(), observe: 'response' })
      .subscribe(
        success => {

          console.log(success.body.toString())

          let productId = success.body["_id"];

          let url = environment.API_URL + "/product/" + productId + "/photo/upload";

          this.http.post(url, formData, { headers: this.appAuthService.getAuthHeader(), observe: 'response' })
            .subscribe(
              success => {

                for (let i = 0; i < this.imageCounter; i++) {
                  if (this.imagesValid[i]) {
                    let id = "imageinput_" + i.toString();
                    let file = (<HTMLInputElement>document.getElementById(id)).files[0];
                    let filename = (<HTMLInputElement>document.getElementById(id)).value;

                    const formData = new FormData();
                    formData.set("photo", file, filename);
                    formData.set("alt", "Product Photo");

                    this.http.post(environment.API_URL + "/product/" + productId + "/photos", formData, { headers: this.appAuthService.getAuthHeader(), observe: 'response' })
                      .subscribe(
                        success => {
                          console.log("Successfully uploaded additional photo");
                        },
                        error => {
                          console.log("There was an error uploading additional photo");
                        });
                  }
                }

                this.toastr.success('You have successfully added your product!', 'Success');
                this.router.navigateByUrl('/products/product-view');
              },
              error => {
                this.toastr.error('There was an error uploading your photo', 'Error');
              });

        },
        error => {

          this.toastr.error("There was an error uploading your product", 'Error!');

          console.log(error.error);

        });
  }
}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);
  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var dw = new DataView(ab);
  for (var i = 0; i < byteString.length; i++) {
    dw.setUint8(i, byteString.charCodeAt(i));
  }
  // write the ArrayBuffer to a blob, and you're done
  return new Blob([ab], { type: mimeString });
}