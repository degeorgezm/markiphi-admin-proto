import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppAuthenticationService } from 'src/app/_services/app-authentication.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Variant, Brand } from 'src/app/_models/sku';
import { Product } from 'src/app/_models/product';

@Component({
    selector: 'app-variant-edit',
    templateUrl: './variant-edit.component.html',
    styleUrls: ['./variant-edit.component.scss']
})
export class VariantEditComponent implements OnInit {


    @ViewChild('img', { static: false }) image: ElementRef;

    public variantId: string;
    public variant: Variant;
    public variants: Variant[] = [];
    public variantLoaded: boolean = false;
    public products: Product[] = [];
    public loaded: boolean = false;

    public defualtImage = "assets/images/variant-color.jpg";
    public imageError: boolean = false;
    public imageMessage: string = "";
    public url = {
        img: this.defualtImage,
    }

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService, private appAuthService: AppAuthenticationService) {
    }

    ngOnInit() {

        this.appAuthService.tokenAuthenticate(() => {

            this.activatedRoute.params.subscribe(parameter => {
                this.variantId = parameter.variantId;

                let url1 = environment.API_URL + "/variants"
                this.http.get(url1, { headers: this.appAuthService.getAuthHeader(), observe: 'response' }).subscribe(
                    success => {
                        let body: any = success.body;

                        body.forEach(element => {
                            let variant = Variant.fromJSON(element);
                            this.variants.push(variant);
                        });

                        let filtered = this.variants.filter(element => element._id == this.variantId);
                        this.variant = filtered[0];
                        this.url.img = this.variant.image != undefined ? this.variant.image : this.defualtImage;
                        this.variantLoaded = true;
                    },
                    error => {
                        this.toastr.error("Error loading page", "Error!");
                        this.router.navigateByUrl("/skus/manage-skus");
                    });
            });
        });
    }

    cancel() {
        this.router.navigateByUrl("/skus/variant-view/" + this.variantId);
    }

    onSubmit(values) {

        values["image"] = this.url.img;

        console.log(values);

        let url = environment.API_URL + "/variants/" + this.variantId;
        this.http.put(url, values, { headers: this.appAuthService.getAuthHeader(), observe: "response" }).subscribe(
            success => {
                this.toastr.success("You have successfully updated variant", "Success!");
                this.router.navigateByUrl("/skus/variant-view/" + this.variantId);
            },
            error => {
                this.toastr.error("Error updating variant", "Error!");
            }
        );
    }

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

                if ((image.height != 300) || (image.width != 300)) {
                    this.imageError = true;
                    this.imageMessage = "Error! Please make sure your image is 300x300px";
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
}

